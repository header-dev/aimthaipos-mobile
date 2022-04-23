export const isRequest = (request) => {

    if (request.no_garlic) {
        return true
    } else
        if (request.no_peanut) {
            return true
        } else
            if (request.no_onion) {
                return true
            } else
                if (request.no_beanshot) {
                    return true
                } else
                    if (request.no_chilli) {
                        return true
                    } else
                        if (request.no_mind) {
                            return true
                        } else
                            if (request.no_spicy) {
                                return true
                            } else
                                if (request.remark) {
                                    return true
                                }

    return false

}

export const menuItem = (item, price) => item + price.padStart(32 - item.length, ".")