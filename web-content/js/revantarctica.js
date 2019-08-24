let dbObject = {
    Author: '',
    Description: '',
    Price: '',
    Title: ''
}

document.getElementById('header').innerText = "LIBRARY";

//this assumes your cloud function will return a value named address with the address to an image, in a cloud storage bucket
async function setUpImages(){
    let images = []
    images.push(document.getElementById('carousel-1'))
    images.push(document.getElementById('carousel-2'))
    images.push(document.getElementById('carousel-3'))
    
    //index is the numbered image in the carousel if that matters to you
    let response = await fetch("https://us-central1-gcproject-bert-1.cloudfunctions.net/get_images")
    datas =  await response.body.json()
    num = 0

    images.forEach(async (value, index)=>{
       
        num += 1
        value.src = datas[num.toString()]
        
    })
}

setUpImages()

document.getElementById('calc-label').innerText = "NUMBER BOOKS"

document.getElementById('calc-input').type = 'number'

function calcSubmit(event){
    event.preventDefault()
    fetch("https://us-central1-gcproject-bert-1.cloudfunctions.net/calc_function", {
        method: 'POST',
        body: JSON.stringify(document.getElementById('calc-input').value)
    })
   /* if(document.getElementById('calc-input').type === 'number'){
        document.getElementById('calc-input').value = 0
    } else {
        document.getElementById('calc-input').value = ''
    }
*/
}



async function buildTable (){
     
     
     let objectResponse = await fetch("https://us-central1-gcproject-bert-1.cloudfunctions.net/get_books")
 
     //console.log(data)

     if(objectResponse.status <200 || objectResponse.status >299){
        let error =document.createElement('p')
        error.innerText = "Fetch Failed"
        document.getElementById('footer-table').appendChild(error)
     }else {
        let objectList = await objectResponse.json()
        //console.log(objectList)
        let headRow = document.createElement('tr')
        document.getElementById('object-table-head').appendChild(headRow)
        for(key in dbObject){
            let th = document.createElement('th')
            //console.log(key)
            th.innerText = key
            th.className = 'object-table-data'
            headRow.appendChild(th)
        }
        
      
        let tbody = document.getElementById('object-table-body')
        Object.values(objectList).forEach(function(v) {
           
            let row = document.createElement('tr')
            tbody.appendChild(row)

            Object.entries(v).forEach(([key, value]) => {
               let data = document.createElement('td')
               data.innerText = value
               data.className = 'object-table-data'
               row.appendChild(data)
            });
            
        })
        
    }
}

function buildForm(){
    for(key in dbObject){
        let div = document.createElement('div')
        div.className = 'form-group'
        document.getElementById('footer-form').appendChild(div)
        let form = document.createElement('input')
        form.className = 'form-control'
        if(typeof(key) === 'number'){
            form.type = 'number'
        } else{
            form.type = 'text'
        }
        form.id = `${key}id`
        let label = document.createElement('label')
        label.for = form.id
        label.innerText = key
        div.appendChild(label)
        div.appendChild(form)
    }

}

function createObject(event){
    event.preventDefault()
    console.log(event);
    let newObj = {}
    for(key in dbObject){
        let input = document.getElementById(`${key}id`)
        newObj[key] = input.value
        console.log(newObj[key])
        if(input.type === 'number'){
            input.value = 0
        } else {
            input.value = ''
        }
    }
    
    fetch('https://us-central1-gcproject-bert-1.cloudfunctions.net/save_book',{
        method: 'POST',
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObj)
    })
}



buildTable()
buildForm()
