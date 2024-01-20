import React from 'react';

const PatientUploadPictureScreen ({navigation, const Page = null?}) => {
    return(
    <View>
        <Button title="Back" onPress={() => navigation.navigate('PatientHome')} />
    </View>
    )
};

export default PatientUploadPictureScreen;