export function getRecords() {
    return new Promise((res)=>{
        setTimeout(() => {
            res(Records);
        }, 1000);
    })
}

const Records = [
    {
        id: 1,
        name: 'Cheng',
        office: 'C103',
        location: 'Shanghai',
        officephone: '6693331552',
        cellphone: '19819197762',
    },
    {
        id: 2,
        name: 'ALi Jiang',
        office: 'C109',
        location: 'Shanghai',
        officephone: '1093331552',
        cellphone: '18819191331',
    },
    {
        id: 3,
        name: 'BKum Jo',
        office: 'C113',
        location: 'Shanghai',
        officephone: '1013331552',
        cellphone: '18819190013',
    }
]