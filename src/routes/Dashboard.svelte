<svelte:head>
    <title>Dashboard - Brokerly</title>
</svelte:head>
<style lang="scss">
    @import "../style/dashboard.scss";
</style>
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
            <input autofocus
                on:change={(e) => brokerInputValue = e.target.value} 
                on:keyup={e => {
                    if (e.key === 'Enter') addBroker()
                }}
                type="text" 
                placeholder="Broker name" 
                bind:this={addBrokerInputElement}
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
                <div class={`status ${
                    new Date() - parseUnixTimestamp(broker.last_online) > 5*60*1000 ? 'offline' : 'online' // check if bot active in last 5 minutes
                }`}>
                    <i class="fas fa-circle"></i>
                </div>
                <div class="name">{broker.botname}</div>
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
                <div class="options">
                    <div class=
                        {`bot-link 
                            ${CopyUrlToClipboardAnimate.state && CopyUrlToClipboardAnimate.token === broker.token ?
                                 'active' : ''}`
                        } 
                        on:click={() => {
                        const isSecure = window.location.protocol.startsWith('https')
                        const botShareUrl = `https://brokerly.tk/bot/${isSecure ? 'secure' : 'unsecure'}/${broker.botname}?url=${window.location.host}`
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
    import { useNavigate, useLocation } from "svelte-navigator";
    import { copyToClipboard, parseUnixTimestamp, toTitleCase } from "./utils";
    import { onMount } from "svelte";

    const navigate = useNavigate();
    const location = useLocation();

    const getBotList = async () => {
        const data = await Api.getBotList(localStorage.token)
        brokers = [...data]
    }
    


    const getBotListPromise = getBotList()


    let brokers = [],
        addBrokerActive,
        addBrokerSelectedElement,
        brokerInputValue,
        copyTokenToClipboardAnimate = false,
        CopyUrlToClipboardAnimate = false,
        addBrokerInputElement

    String.prototype.toTitleCase = toTitleCase;

    const addBroker = async () => {
        const token = await Api.createBot(brokerInputValue,  'title', 'desc', localStorage.token)
        brokers = [{botname: brokerInputValue, token: token, last_online: 0}, ...brokers]
        addBrokerActive = false
    }

    const activateAddBroker = () => {
            addBrokerActive = true
    }
</script>

