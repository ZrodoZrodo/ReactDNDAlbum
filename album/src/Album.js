import './App.css';
import axios from 'axios';
import { useState } from 'react';
const { v4: uuid } = require('uuid');

const AlbumComponent = (props) => {
    const [album, setAlbum] = useState([]);
    const [limit, setLimit] = useState(true);
    //this function check photos and if file is a photo add to table
    const addPhoto = (photo) => {
        const validPhoto = [];
        for (let i = 0; i < photo.length; i++) {
            if (
                photo[i].type === 'image/png' ||
                photo[i].type === 'image/jpeg' ||
                photo[i].type === 'image/jpg'
            ) {
                console.log(photo[i]);
                validPhoto.push(photo[i]);
            }
        }
        if (validPhoto.length + album.length <= props.limit) {
            const arrayCopy = [...album];
            for (let i = 0; i < validPhoto.length; i++) {
                arrayCopy.push({ photo: validPhoto[i], id: uuid() });
            }
            if (arrayCopy.length === 10) {
                setLimit(false);
            }
            setAlbum(arrayCopy);
        } else {
            console.log('limit of photos is set to',props.limit);
        }
    };

    //this function delete a photo
    const deletePhoto = (e) => {
        const arrayCopy = [...album].filter(
            (photo) => photo.id !== e.target.id
        );
        if (arrayCopy.length < 10) {
            setLimit(true);
        }
        console.log(arrayCopy);
        if (arrayCopy.length === 0) {
            const background = document.getElementById('background');
            background.style.backgroundImage = `url('')`;
        }

        setAlbum(arrayCopy);
    };
    //you want to send a photos you can du that here
    const send = () => {
        const data = album.map((x) => x.photo);
        console.log(data);
        const formData=new FormData();
        data.forEach(photo=>{
            formData.append('photo',photo)
        })
        axios.post(props.url, formData).then((data) => {
            console.log(data);
        });

    };


    const listPhotos = album.map((photo) => (
        <img
            src={`${URL.createObjectURL(photo.photo)}`}
            alt='error'
            id={photo.id}
            key={photo.id}
            onClick={(e) => deletePhoto(e)}
            width={'100px'}
            height={'100px'}
        />
    ));
    return (
        <>
            <button
                onClick={() => {
                    send();
                }}
            >
                send
            </button>

            <div
                id='background'
            >
                {limit ? (
                    <input
                        multiple='multiple'
                        id='input'
                        name='file'
                        type='file'
                        onChange={(e) => {
                            addPhoto(e.target.files);

                            e.target.value = null;
                        }}
                    />
                ) : (
                    <input
                        id='input'
                        name='file'
                        type='file'
                    />
                )}
            </div>
            <div id={'grid'}>
                {listPhotos}
            </div>
        </>
    );
};

export default AlbumComponent;