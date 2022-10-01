export const handleFailure = (error) => {
    let message = "";
    if (error.response) {
        message = error.response.data.message
    } else if (error.request) {
        message = error.request
    } else {
        message = error.message || error.toString()
    }
    return message
}


export const emailExists = (error) => {
    if(error.response.data.errors.email) {
        return error.response.data.errors.email[0];
    }
}
