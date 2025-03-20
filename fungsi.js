const fs = require('fs')
const dirPath = 'data'
const filePath = 'data/data.JSON'

if(!fs.existsSync(dirPath)){fs.mkdirSync(dirPath)}

if(!fs.existsSync(filePath)){fs.writeFileSync(filePath,'[]','utf-8')}

const loadData = () => {
    const file = fs.readFileSync(filePath,'utf-8')
    const datas = JSON.parse(file)
    return datas
}

const saveData = (datas)=>{
    fs.writeFileSync(filePath,JSON.stringify(datas),'utf-8')
}

const duplicate = (name) =>{
    const datas = loadData()
    const duplikat = datas.find((data) => data.name === name)
    return duplikat;
}

const addData = (data) =>{
    const datas = loadData()
    datas.push(data)
    saveData(datas)
}

const deleteData = (name) =>{
    const datas = loadData()
    const newData = datas.filter(a => a.name !== name)
    saveData(newData)
}

const editData = (data)=>{
    const datas = loadData()
    const filteredData = datas.filter(a => a.name !== data.oldName)
    delete data.oldNama
    console.log(data)
    filteredData.push(data)
    saveData(filteredData)
}


module.exports = {loadData,addData,duplicate,deleteData,editData}