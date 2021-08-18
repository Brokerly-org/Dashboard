<button
    on:click={clickHandler}
    on:touchstart={ (e) => timer(touchduration, e) } 
    on:touchend={ () => clearTimeout(timerInterval) }
    class={
        $$props.class ? 
        $$props.class + " btn-btn-ripple" :
        "btn-btn-ripple"
    }   
>
{text}
</button>
<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let text;

    // Touch holding
    var timerInterval, touchduration = 100

    const clickHandler = (e) => {
        dispatch('click')
        
        var x = e.clientX - e.target.offsetLeft;
        var y = e.clientY - e.target.offsetTop;
        let ripples = document.createElement("span");
        ripples.classList.add("span-span-ripple");
        ripples.style.left = x + "px";
        ripples.style.top = y + "px";
        e.target.appendChild(ripples);
        setTimeout(() => ripples.remove(), 400);
    };
 
    const timer = (interval, e) => {
        interval--;

        if (interval >= 0) {
            timerInterval = setTimeout(() => {
                timer(interval, e);
            });
        } else {
            taphold(e);
        }
    };

    const taphold = (e) => {
        touch = e.touches[0];
        let x = touch.pageX - e.target.offsetLeft;
        let y = touch.pageY - e.target.offsetTop;
        let ripples = document.createElement("span");
        ripples.classList.add("span-span-ripple");

        ripples.style.left = x + "px";
        ripples.style.top = y + "px";
        e.target.appendChild(ripples);
        setTimeout(() => ripples.remove(), 700);
    };
</script>


<style lang="scss" global>
    .btn-btn-ripple {
        position: relative;
        overflow: hidden;
        &:focus {
            /* disable chrome android wired animations */
            -webkit-tap-highlight-color: transparent;
            outline: none;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
        }
        &:hover {
            cursor: pointer;
        }
        .span-span-ripple {
            background: #fff;
            position: absolute;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: 0.4s animate infinite linear;
            @keyframes animate {
                0% {
                    width: 0px;
                    height: 0px;
                    opacity: 0.7;
                }
                100% {
                    width: 500px;
                    height: 500px;
                    opacity: 0;
                }
            }
        }
    }
</style>


