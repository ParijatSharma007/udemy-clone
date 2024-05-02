let token : null | string | undefined = null
let userId : null | string | undefined = null

const getToken = () => {
    return token
}
const setToken = (tk : string | undefined | null)=> {
    token = tk
}

const getUserId = () => {
    return userId
}
const setUserId = (id : string | undefined | null) => {
    userId = id
}

export {
    getToken,
    setToken,
    getUserId,
    setUserId
}