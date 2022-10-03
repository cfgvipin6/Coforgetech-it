export const presentAddress=()=>{
let value =  this.createAddressJSON('co', '1587', 'block abcd', 'town hall', 'near ghanta ghar',
    'ghaziabad', 'India', 'UP', '201204', 'Ghaziabad', '9999988888');

    // console.log("Desired value : " , value);
    return value;
}
    

// export const permanentAddress = JSON.stringify(
//     this.createAddressJSON('co', '1587', 'block abcd', 'town hall', 'near ghanta ghar',
//     'ghaziabad', 'India', 'UP', '201204', 'Ghaziabad', '9999988888')
// );

// export const emergencyAddress = JSON.stringify(
//     this.createAddressJSON('co', '1587', 'block abcd', 'town hall', 'near ghanta ghar',
//     'ghaziabad', 'India', 'UP', '201204', 'Ghaziabad', '9999988888')
// );

// export const workAddress = JSON.stringify(
//     this.createAddressJSON('co', '1587', 'block abcd', 'town hall', 'near ghanta ghar',
//     'ghaziabad', 'India', 'UP', '201204', 'Ghaziabad', '9999988888')
// );

 createAddressJSON = (co, house, block, firstAddress, secondAddress, city,
    country, state, postal, district, telephone) => {
        return{
        "C/O": co,
        "House Number": house,
        "Block/Pocket": block,
        "1st Address Line*": firstAddress,
        "2nd Address Line": secondAddress,
        "City*": city,
        "Country Key*": country,
        "State": state,
        "Postal Code*": postal,
        "District": district,
        "Telephone Number": telephone
        }
}

export const replica  = {
        
        "C/O": 'co',
        "HouseNumber": 'house',
        "Block/Pocket": 'block',
        "1st Address Line*": 'firstAddress',
        "2nd Address Line": 'secondAddress',
        "City*": 'city',
        "Country Key*": 'country',
        "State": 'state',
        "Postal Code*": 'postal',
        "District": 'district',
        "Telephone Number": 'telephone'
}
