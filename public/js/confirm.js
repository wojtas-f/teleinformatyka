const confirmRemove = ()=>{
    const confirmation = prompt('Ta akcja spowoduje usuniecie twojego konta. Jeśli chcesz kontynuować wpisz NA PEWNO')
    if( confirmation === 'NA PEWNO'){
        return true
    }
    else {
        return false
    }
}

const confirmLogoutAll = ()=>{
    const confirmation = prompt('Ta akcja spowoduje wylogowanie ze wszystkich urządzeń. Jeśli chcesz kontynuować wpisz NA PEWNO')
    if( confirmation === 'NA PEWNO'){
        return true
    }
    else {
        return false
    }
}

