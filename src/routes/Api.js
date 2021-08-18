export default class Api {
    
    static async createBot(botName, title, desc, token) {
        // /user/create_bot put
        const res = await fetch(
            `/user/create_bot?botname=${botName}&title=${botName.toTitleCase()}&description=Hi, I'm description&token=${token}`,
            { method: "PUT" }
        );
        const data = await res.json();
        return data.bot_token;
    }

    static async deleteBot(botName, token) {
        // /user/delete_bot delete
        const res = fetch(`/user/delete_bot?botname=${botName}&token=${token}`, {
            method: "DELETE",
        });
        return await res.json()
    }

    static async getBotList(token) {
        const res = await fetch(`/user/bot_list?token=${token}`);
        const data = await res.json();
        const bots = data.bots;
        return bots
    }

    static async login(user, pass) {
        const res = await fetch(`/user/login?email=${user}&password=${pass}`, { method: "POST" })
        return res
    }

    static async register(user, pass) {
        const res = await fetch(
            `/user/register?email=${user}&password=${pass}&name=todo`,
            { method: "POST" }
        );
        return await res.json()
    }
}