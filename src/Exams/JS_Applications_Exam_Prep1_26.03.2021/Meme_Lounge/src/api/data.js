import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getMemes() {
    return await api.get(host + '/data/memes?sortBy=_createdOn%20desc');
}

export async function getMemeById(id) {
    return await api.get(host + '/data/memes/' + id);
}

export async function getMyMemes() {
    const userId = sessionStorage.getItem('userId');
    return await api.get(host + `/data/memes?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}

export async function createMeme(data) {
    return await api.post(host + '/data/memes', data);
}

export async function editMeme(id, data) {
    return await api.put(host + '/data/memes/' + id, data);
}

export async function deleteMeme(id) {
    return await api.del(host + '/data/memes/' + id);
}

/*
export async function XgetMemes() {
    return Object.values(await api.get(host + '/jsonstore/memes'));
}

export async function XgetMemeById(id) {
    return await api.get(host + '/jsonstore/memes/' + id);
}

export async function XgetMyMemes() {
    const userId = sessionStorage.getItem('userId');
    const memems = await api.get(host + `/jsonstore/memes`);
    return Object.values(memes).filter(m => m._ownerId == userId);
}

export async function XcreateMeme(data) {
    meme._ownerId = sessionStorage.getItem('userId');
    return await api.post(host + '/jsonstore/memes', data);
}

export async function XeditMeme(id, data) {
    return await api.put(host + '/jsonstore/memes/' + id, data);
}

export async function XdeleteMeme(id) {
    return await api.del(host + '/jsonstore/memes/' + id);
}
*/