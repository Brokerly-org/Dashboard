import {parseUnixTimestamp, toTitleCase} from './utils'


export default class Api {
    
    static async createBot(botName, title, desc, token) {
        // /user/create_bot put
        const res = await fetch(
            `/admin/create_bot?botname=${botName}&title=${ toTitleCase(botName) }&description=Hi, I'm description&token=${token}`,
            { method: "PUT" }
        );
        const data = await res.json();
        return data.bot_token;
    }

    static async deleteBot(botName, token) {
        // /user/delete_bot delete
        const res = fetch(`/admin/delete_bot?botname=${botName}&token=${token}`, {
            method: "DELETE",
        });
        return await res.json()
    }

    static async getBotList(token) {
        const res = await fetch(`/admin/bot_list?token=${token}`);
        const data = await res.json();
        const bots = data.bots;
        return bots
    }

    static async login(user, pass) {
        const res = await fetch(`/auth/login?email=${user}&password=${pass}`, { method: "POST" })
        return res
    }

    static async register(user, pass) {
        const res = await fetch(
            `/auth/register?email=${user}&password=${pass}&name=todo`,
            { method: "POST" }
        );
        return await res.json()
    }

    static generateBotUrl(botName, host, isSecure) {
        const botShareUrl = `https://brokerly.tk/bot/${isSecure ? 'secure' : 'unsecure'}/${botName}?url=${host}`
        return botShareUrl
    }

    static isOnline(last_online) {
        return new Date() - parseUnixTimestamp(last_online) > 5*60*1000
    }
}