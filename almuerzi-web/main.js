let mealsState = []

const stringToHTML = (string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(string, 'text/html')

    return doc.body.firstChild
}

const renderItem = (item) => {
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)

    element.addEventListener('click', () => {
        const mealsList = document.getElementById('meals-list')
        Array.from( mealsList.children ).forEach( x => x.classList.remove('selected') )
        element.classList.add('selected')
        const mealsIdInput = document.getElementById('meals-id')
        mealsIdInput.value = item._id
    })

    return element
}

// const renderOrderOther = (order) => {
//     fetch('https://serverless.omarfandino.vercel.app/api/meals/' + order.meal_id)
//         .then( response => response.json() )
//         .then ( data => {
//             plato = `<li data-id="${order._id}">${data.name} - ${order.user_id}</li>`
//             console.log(plato)
//         })
//     return plato
// }

const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`)

    return element
}

window.onload = () => {
    const orderForm = document.getElementById('order')
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const submit = document.getElementById('submit')
        submit.setAttribute('disabled', true)
        const mealId = document.getElementById('meals-id')
        const mealIdValue = mealId.value
        if (!mealIdValue) {
            alert('Debe seleccionar un plato')
            return
        }

        const order = {
            meal_id: mealIdValue,
            user_id: 'Omar Fandiño'
        }

        fetch('https://serverless.omarfandino.vercel.app/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        }).then( x => x.json() )
        .then( response => {
            const renderedOrder = renderOrder(response, mealsState)
            const ordersList = document.getElementById('orders-list')
            ordersList.appendChild(renderedOrder)
            submit.removeAttribute('disabled')
        })
    }

    fetch('https://serverless.omarfandino.vercel.app/api/meals')
        .then( response => response.json() )
        .then ( data => {
            mealsState = data
            const mealsList = document.getElementById('meals-list')
            const submit = document.getElementById('submit')
            const listItems = data.map( renderItem )
            mealsList.removeChild(mealsList.firstElementChild)
            listItems.forEach( element => mealsList.appendChild(element) )
            submit.removeAttribute('disabled')
            fetch('https://serverless.omarfandino.vercel.app/api/orders')
                .then( response => {
                    let ordersData = response.json()
                    console.log(ordersData)
                })
                // .then ( ordersData => {
                //     const ordersList = document.getElementById('orders-list')
                //     // const listOrders = ordersData.map( renderOrderOther )
                //     // console.log(listOrders)
                //     const listOrders = ordersData.map( orderData => renderOrder(orderData, data) )
                //     ordersList.removeChild(ordersList.firstElementChild)
                //     listOrders.forEach( element => ordersList.appendChild(element) )
                // })
        })
}