import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import md5 from 'react-native-md5';
import { Icon } from "react-native-elements";
let RNFS = require('react-native-fs');

const uploadfileMD5 = () => {


    useEffect(() => {
        let hex_md5v = md5.hex_md5( Date.now() +"" );
        console.log(">>>>hex_md5:", hex_md5v);

        let b64_md5v = md5.b64_md5( Date.now() +"" );
        console.log(">>>>b64_md5:", b64_md5v);

        let str_md5v = md5.str_md5( Date.now() +"" );
        console.log(">>>>str_md5:", str_md5v);

        let hex_hmac_md5v = md5.hex_hmac_md5("my_key", Date.now() +"" );
        console.log(">>>>hex_hmac_md5:", hex_hmac_md5v);

        let b64_hmac_md5v = md5.b64_hmac_md5("my_key", Date.now() +"" );
        console.log(">>>>b64_hmac_md5:", b64_hmac_md5v);

        let str_hmac_md5v = md5.str_hmac_md5("my_key", Date.now() +"" );
        console.log(">>>>str_hmac_md5:", str_hmac_md5v);
    }, [])

    const uploadFile = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then(res => {console.log("file", res)
                return Promise.all([RNFS.stat(res[0].path), res[0].path]);
            })
            .then(response => {
                if (response[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(response[1], 'utf8');
                  }
              
                  return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
              })
              .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    return (
        <View>
            <TouchableOpacity onPress={uploadFile}
                style={{paddingTop: 6, alignSelf:'flex-start'}}>
                    <Icon name="attachment" size={30} color={'black'}/>
                </TouchableOpacity>
        </View>
    )
}

export default uploadfileMD5
