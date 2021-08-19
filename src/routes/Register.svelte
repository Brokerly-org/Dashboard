<svelte:head>
    <title>Register - Brokerly</title>
</svelte:head>
<style lang="scss">
    @import "../style/register.scss";
</style>

<div class="logo">Brokerly</div>
<div class="title">Sign up</div>
<div class="register">
    <input 
        on:change={(e) => (userInputValue = e.target.value)}
        on:keyup={e => {
            if (e.key === 'Enter') handleRegister()
        }}
        type="text" placeholder="Username" 

    />
    <div class="input-password">
        <input
            type={inputPassVisible ? "text" : "password"}
            placeholder="Password"
            autocomplete="false"
            bind:this={inputPassElement}
            on:change={(e) => (passInputValue = e.target.value)}
            on:keyup={e => {
                if (e.key === 'Enter') handleRegister()
            }}
        />

        <i
            on:mousedown={e => e.preventDefault()}
            on:click={toggleInputPass}
            class={inputPassVisible ? "fas fa-eye" : "fas fa-eye-slash"}
        />
    </div>
    <RippleButton text="Register" on:click={handleRegister} />
</div>

<p 
on:click={() => navigate('/login')} 
class="already">
Already have an account?</p>



<script>
    import RippleButton from "../components/rippleButton.svelte";
    import { useNavigate, useLocation } from "svelte-navigator";
    import Api from "./Api";


    let inputPassVisible = false,
    passInputValue = '',
    userInputValue,
    inputPassElement


    const navigate = useNavigate();
    const location = useLocation();


    const toggleInputPass = (e) => {
        e.preventDefault()
        inputPassVisible = !inputPassVisible
        inputPassElement.focus()
    }
    /* username must be with mail format!!!! */
    async function handleRegister() {
        if (!userInputValue || !passInputValue) return;
        const res = await Api.register(userInputValue, passInputValue)
        const token = res.token;
        localStorage.setItem("token", token);
        navigate('/dashboard')
    }
</script>


