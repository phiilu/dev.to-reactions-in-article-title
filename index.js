import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const POST_ID = process.env.POST_ID;
const BASE_URL = `https://dev.to/api`;
const client = axios.create({
    baseURL: BASE_URL, headers: {
        'api-key': process.env.API_KEY
    }
})
let currentReactionsCount = 0;

const API = {
    article(id = POST_ID) {
        return client.get(`/articles/${id}`);
    },
    updateArticle(id = POST_ID, body) {
        return client.put(`/articles/${id}`, body);
    }
};

const sleep = async (amount = 30000) => new Promise(resolve => setTimeout(resolve, amount))

while (true) {
    try {
        const { data } = await API.article();
        const { public_reactions_count } = data;
        const newTitle = `This post has ${public_reactions_count} reactions! - Using the dev.to API to update the post title with the reactions count!`

        if (currentReactionsCount !== public_reactions_count) {
            await API.updateArticle(POST_ID, { title: newTitle });
            currentReactionsCount = public_reactions_count;
            console.log(`Article updated - Reactions: ${currentReactionsCount}`)
        } else {
            console.log(`Reaction count was the same`)
        }
    } catch (error) {
        console.log(error.message)
    } finally {
        await sleep();
    }
}