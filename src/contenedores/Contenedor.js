const fs = require('fs');

class Contenedor {
    constructor(filename){  
        this.filename = filename   
    }
    start(){
        fs.writeFileSync(this.filename, JSON.stringify([]))
    }
     save(object){
            if (object == undefined){
                this.deleteAll()
            }
            const obj =  this.getAll()
            const objJSON = JSON.parse(obj)            
            if (objJSON.length == 0){
                object.id = 1
                objJSON.push(object)
            }else{
                object.id = objJSON[objJSON.length-1].id + 1
                objJSON.push(object)
            }
            fs.writeFileSync(this.filename, JSON.stringify(objJSON))
    }
     getAll(){
        try {
            const data = fs.readFileSync(this.filename, 'utf-8')
            return data
          } catch (err) {
            console.log(err)
          }
          
    }
    getById(number){
        try {
            const data = fs.readFileSync(this.filename, 'utf-8')
            if (JSON.parse(data)[number-1] != undefined)
                return JSON.parse(data)[number-1]
            else
                return null
        } catch(err) {
            console.log(err)  
        }
    }
    deleteById(number){
        try {
            const data = fs.readFileSync(this.filename, 'utf-8')
            const dataJSON = JSON.parse(data)
            for( var i = 0; i < dataJSON.length; i++){ 
    
                if ( dataJSON[i].id == number) { 
            
                     dataJSON.splice(i, 1); 
                }
            }
            fs.writeFileSync(this.filename, JSON.stringify(dataJSON))
        } catch(err) {
            console.log(err)  
        }
    }
     deleteAll(){
        try {
            fs.writeFileSync(this.filename, JSON.stringify([]))
        } catch(err) {
            console.log(err)  
        }
    }
  getByIdRandom(){
        try {
            const data = fs.readFileSync(this.filename, 'utf-8')
            const dataLength = JSON.parse(data).length
            const random = Math.floor(Math.random()*(dataLength+1))
            return JSON.parse(data)[random-1]
            
        } catch(err) {
            console.log(err)  
        }
    }
}

module.exports = Contenedor