import api from "./api"

export const getTotalIssues = async (number) => {
    const response = await api.get('/search/issues?q=repo:axios/axios+type:issue+state:open', {
        params: { page: number }
    });
    return response;
}