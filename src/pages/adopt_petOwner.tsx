import React, { useEffect, useState } from 'react';
import './landingpage.css';
import { IonImg, IonContent, IonPage, IonButton } from '@ionic/react';
import dog1 from '../assets/dog 1.png';
import footprint1 from '../assets/footprint 1.png';
import cat1 from '../assets/cat 1.png';
import paw1 from '../assets/paw 1.png';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


type Pet = {
    id: string;
    index: number,
    name: string;   
    age: number;
    gender: 'male' | 'female';
    neutered: 'yes' | 'no';
    type: 'cat' | 'dog';
    breed: string;
    weight: number;
    location: string;
    about: string;
    caretakerInfo: string;
    imageUrl: string;
};

const LandingPage: React.FC = () => {

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const storageRef = firebase.storage().ref();

    useEffect(() => {
        const fetchImages = async () => {
            const result = await storageRef.child('images').listAll();
            const urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());
            return Promise.all(urlPromises);
        };

        const loadImages = async () => {
            const urls = await fetchImages();
            setImageUrls(urls);
        };

        loadImages();
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchPets = async () => {
          const db = firebase.firestore();
          const petCollection = db.collection('pets').orderBy('index');
          const petSnapshot = await petCollection.get();
          const petList: Pet[] = petSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Pet);
          setPets(petList);
        };
      
        fetchPets();
      }, []);

    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo">
                        <h1 className="h1_logo">FurPet</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/petOwnerHome">Home</a>
                        <a href="/petOwnerAdopt">Adopt</a>
                        <a href="/rehome">Rehome</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="categories1">
                    <h1 className="categories_h1">Categories</h1>
                    <div className="categories_container">
                        <div className="categories_box">
                            <img src={dog1} />
                            <p className="categories_text">Dogs</p>
                        </div>
                        <div className="categories_box">
                            <img src={footprint1} />
                            <p className="categories_text">Puppies</p>
                        </div>
                        <div className="categories_box">
                            <img src={cat1} />
                            <p className="categories_text">Cats</p>
                        </div>
                        <div className="categories_box">
                            <img src={paw1} />
                            <p className="categories_text">Kittens</p>
                        </div>
                    </div>
                    <div className="findAndAdopt1">
                        <h1 className="findAndAdopt_h1">Find & Adopt</h1>
                        <div className="findAndAdopt_dropdown">
                            <button className="findAndAdopt_dropbtn">Category...</button>
                            <div className="findAndAdopt_dropdown-content">
                                <a href="#">Cat</a>
                                <a href="#">Dog</a>
                                <a href="#">Puppies</a>
                                <a href="#">Kitten</a>
                            </div>
                        </div>
                        <input type='text' className="findAndAdopt_input" placeholder="Age..." />
                        <div className="findAndAdopt_filter"><p className='findAndAdopt_text'>Filter</p></div>
                    </div>
                </div>
                <div className="adoption1">
                    <h1 className="adpotion_h1">For Adoption</h1>
                    <div className="adoption_container">
                        {pets.map((pet, i) => (
                            <div className="adoption_box">
                                <img className="adoption_image" key={i} src={imageUrls[i]} alt={pet.name} />
                                <p className="adoption_text" key={i}>{pet.breed}</p>
                                <p className="adoption_desc" key={i}>{pet.age} Years Old</p>
                                <p className="adoption_desc" key={i}>{pet.gender}</p>
                                <p className="adoption_desc" key={i}>{pet.weight} kg</p>
                                <p className="adoption_desc" key={i}>{pet.location}</p>
                                <Link to={`/petOwnerAdoptme/${pet.id}`}><div className="adoptMe"><p className='adoption_button'>Adopt Me</p></div></Link>
                            </div>
                        ))}
                        <div className="adoption_box2">
                            <img src={footprint1} />
                            <a href="/adopt"><div className="adoptMe2"><p className='adoption_button'>Meet More</p></div></a>
                        </div>
                    </div>
                </div>
                <div className="space"></div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;