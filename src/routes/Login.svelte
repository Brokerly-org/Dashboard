<svelte:head>
    <title>Login - Brokerly</title>
</svelte:head>
<style lang="scss"> @import '../style/login'; </style>

<div class="logo">Brokerly</div>
<div class="title">Sign in</div>
<div class="login">
    <div class="input-username">
        <input 
            on:change={e => userInputValue = e.target.value}
            type="text" placeholder="Username" />
    </div>
    <div class="input-password">   

        <input 
            type={inputPassVisible ? 'text' : 'password'} 
            placeholder="Password" 
            autocomplete="false" 
            on:change={ e => passInputValue = e.target.value }
            on:keypress={e => {
                console.log(e.key === 'Enter')
                console.log(passInputValue)
                if (e.key === 'Enter') loginHandler()
            }}
            bind:this={inputPassElement}
        />

        <i 
            on:click={toggleInputPass} 
            on:mousedown={e => e.preventDefault()}
            on:mouseup={e => e.preventDefault()}
            class={inputPassVisible ? 
                'fas fa-eye' : 
                'fas fa-eye-slash'
            } 
        />
    </div>

    <p class="wrong-password" class:active="{wrongPassTyped}" bind:this={wrongPassElement} >Username or password incorrect</p>
    <RippleButton text="Login" on:click={loginHandler} />
</div>

<div class="separator" />
<button class="register" on:click={() => navigate('/register')}>
    Sign up
</button>




<script>
    import RippleButton from "../components/rippleButton.svelte";
    import { navigate } from "svelte-navigator";
import Api from "./Api";
import { debug } from "svelte/internal";

    let passInputValue = '', 
    userInputValue = '',
    inputPassVisible = false,
    inputPassElement,
    wrongPassElement,
    wrongPassTyped = false

    const toggleInputPass = (e) => {
        e.preventDefault();
        inputPassVisible = !inputPassVisible
        inputPassElement.focus()
        
    }

    const loginHandler = async () => {
        console.log('login handler')
        // if (!userInputValue || !passInputValue) return
        debugger
        const res = await Api.login(userInputValue, passInputValue)
        if (res.status !== 200) {
            console.log('wrong pass')
            wrongPassTyped = true
            return
        }
        const data = await res.json()
        if (data.token) {
            localStorage.setItem('token', data.token)
            navigate('/dashboard')
        }
    }
</script>







