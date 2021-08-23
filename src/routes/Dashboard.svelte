<svelte:head>
    <title>Dashboard - Brokerly</title>
</svelte:head>
<style lang="scss">
    @import "../style/dashboard/dashboard.scss";
</style>



{#if openScanQrModal.state}
    <div class="qr-modal">
        <div class="inner">
            <div class="container qr-code">
                <QrCode value={openScanQrModal.url} size=230/>
            </div>
            <button class="close"
                on:click={() => {
                    openScanQrModal = {state: false}
                }}
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
            <div class="instructions">
                <div class="qr-title">To use Brokerly on your phone:</div>
                <div class="list">
                    <p>1. open Brokerly on your phone</p>
                    <div class="second-instruction">
                        <p>2. Tap the action button</p>
                        <ActionButton class="action-button" />
                    </div>
                    <div class="third-instruction">
                        <p>3. Tap the qr scan button</p>
                        <QrSvg class='qr-svg' />
                    </div>
                    <p>4. Point your phone to this screen to capture the code</p>
                </div>
            </div>
        </div>
    </div>
{/if}

<nav>
    <div class="logo">Brokerly</div>
    <div class="sign-out" on:click={() => {
        localStorage.clear()
        navigate("/login")
    }}>
        <i class="fa fa-sign-out" aria-hidden="true" />
    </div>
</nav>
<div class="download-app" />
<div class="title">Brokers</div>
<div class="brokers-list">

    {#if ! addBrokerActive}
        <div class="add-broker" on:click={activateAddBroker}>
            <i class="fas fa-plus" />
        </div>
    {:else}
        <div class="add-broker-selected"
            bind:this={addBrokerSelectedElement}
        >
            <!-- svelte-ignore a11y-autofocus -->
            <input
                autofocus={true}
                bind:this={addBrokerInputElement}
                on:change={(e) => brokerInputValue = e.target.value} 
                on:keyup={e => {
                    if (e.key === 'Enter') addBroker()
                }}
                type="text" 
                placeholder="Broker name" 
            />
            <button class="save" on:click={addBroker}>Save</button>
            <button class="cancel" on:click={() => (addBrokerActive = false)}>
                Cancel
            </button>
        </div>
    {/if}

    {#await getBotListPromise}
        <p>loading..</p>
    {:then} 
        {#each brokers as broker (broker.token)}
            <div class="broker">
                <div class="tooltip"><span class="tooltiptext">broker {Api.isOnline(broker.last_online) ? 'offline' : 'online'}</span>
                    <div class={`status ${
                        Api.isOnline(broker.last_online) ? 'offline' : 'online' // check if bot active in last 5 minutes
                    }`}>
                        <i class="fas fa-circle"></i>
                    </div>
                </div>
                <div class="name">{broker.botname}</div>
                <div class="tooltip"><span class="tooltiptext">copy token</span>
                    <div class="token" on:click={() => {
                        
                        copyToClipboard(broker.token)
                        copyTokenToClipboardAnimate = {state: true, token: broker.token}
                        setTimeout(() => {
                            copyTokenToClipboardAnimate = {state: false, token: null}
                        }, 2000)

                    }}>
                        <p>{broker.token}</p>
                        {#if copyTokenToClipboardAnimate.state == true && copyTokenToClipboardAnimate.token == broker.token }
                            <i class="fas fa-check"></i>
                        {:else}
                                <i class="fas fa-copy"></i>
                        {/if}
                    </div>
                </div>
                <div class="tooltip"><span class="tooltiptext">Scan qr</span>
                    <i class="fa fa-qrcode qr" aria-hidden="true" 
                        on:click={() => {
                            const host = window.location.host
                            const isSecure = window.location.protocol.startsWith('https')
                            const botShareUrl = Api.generateBotUrl(broker.botname, host, isSecure)
                            
                            openScanQrModal = {state: true, url: botShareUrl}
                        }}
                    />
                </div>

                <div class="options">
                    <div class=
                        {`bot-link 
                            ${CopyUrlToClipboardAnimate.state && CopyUrlToClipboardAnimate.token === broker.token ?
                                 'active' : ''}`
                        } 
                        on:click={() => {
                        const isSecure = window.location.protocol.startsWith('https')
                        const host = window.location.host
                                               
                        const botShareUrl = Api.generateBotUrl(broker.botname, host, isSecure)
                        copyToClipboard(botShareUrl)
                        CopyUrlToClipboardAnimate = {state: true, token: broker.token}
                        setTimeout(() => {
                            CopyUrlToClipboardAnimate = {state: false, token: null}
                        }, 2000)
                        
                    }}>
                        {#if CopyUrlToClipboardAnimate.state && CopyUrlToClipboardAnimate.token === broker.token}
                            <i class="fas fa-check"></i>
                        {:else}
                            <i class="fas fa-link"></i>
                        {/if}
                    </div>
                    <div class="remove" on:click={ () => {
                        brokers = brokers.filter(i => i.token !== broker.token) 
                        Api.deleteBot(broker.botname, localStorage.token)
                    }}>
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </div>
        {/each}
    {/await}

    {#if brokers.length === 0}
        <EmptyDash className='empty-dash' />
    {/if}
</div>

<script>
    import Api from './Api'
    import EmptyDash from '../components/emptyDash.svg.svelte';
    import ActionButton from '../components/ActionButton.svg.svelte'
    import QrSvg from '../components/qr.svg.svelte'
    import { useNavigate, useLocation } from "svelte-navigator";
    import { copyToClipboard } from "./utils";
    import QrCode from "svelte-qrcode"

    
    

    const navigate = useNavigate();
    const location = useLocation();

    const getBotList = async () => {
        const data = await Api.getBotList(localStorage.token)
        brokers = [...data]
    }
    


    const getBotListPromise = getBotList()


    let brokers = [],
        addBrokerActive = false,
        addBrokerSelectedElement,
        brokerInputValue = '',
        copyTokenToClipboardAnimate = false,
        CopyUrlToClipboardAnimate = false,
        addBrokerInputElement,
        openScanQrModal = {state: false, url: ''}

    


    const addBroker = async () => {
        const token = await Api.createBot(brokerInputValue,  'title', 'desc', localStorage.token)
        brokers = [{botname: brokerInputValue, token: token, last_online: 0}, ...brokers]
        addBrokerActive = false
    }

    const activateAddBroker = () => {
            addBrokerActive = true
    }

    
</script>

