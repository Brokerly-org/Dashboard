<script>
	import { Router, Route, navigate } from "svelte-navigator";
	import Login  from './routes/Login.svelte'
	import Register from "./routes/Register.svelte";
	import Dashboard from "./routes/Dashboard.svelte";
	if (localStorage.token) {
		navigate('/dashboard')
	} else {
		navigate('/login')
	}
</script>
<style lang="scss">@import 'style/base.scss';</style>
<svelte:head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- font awesome  -->
    <script src="https://kit.fontawesome.com/afc4cff0c1.js" crossorigin="anonymous"></script>
</svelte:head>
<Router>
	<main>
		<!-- todo change to conditional route -->
	  <Route path="/" component={Login} />
	  <Route path="/login" component={Login} />
	  <Route path="/register" component={Register} />
	  <Route path="/dashboard" component={Dashboard} />
	</main>
</Router>

  