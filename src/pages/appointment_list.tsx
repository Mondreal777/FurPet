import React, { useEffect, useState } from 'react';
import './rehome.css';
import { IonImg, IonContent, IonPage, IonButton } from '@ionic/react';
import Delete from '../assets/material-symbols_delete-outline.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

type Appointment = {
    id: string;
    appoint_name: string;
    appoint_number: string;
    appoint_email: string;
    appoint_address: string;
    appoint_date: string;
    pet_name: string;
    pet_caretaker: string;
    pet_location: string;
    pet_index: string;
};

const LandingPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = firebase.firestore();
            const data = await db.collection('appointment').get();
            setAppointments(data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Appointment));
        };
        fetchData();
    }, []);

    const deleteAppoint = async (id: string) => {

        const db = firebase.firestore();

        if (window.confirm('Are you sure you want to delete this pet?')) {
            await db.collection('appointment').doc(id).delete();
            setAppointments(appointments.filter(appointment => appointment.id !== id));
        }
    };

    return (
        <IonPage>
            <IonContent>
                <nav>
                    <div className="logo">
                        <h1 className="h1_logo">FurPet</h1>
                    </div>
                    <div className="nav-links">
                        <a href="/adopterHome">Home</a>
                        <a href="/adopterAdopt">Adopt</a>
                        <a href="/appointmentlist">Appointments</a>
                        <a href="/login">Log Out</a>
                    </div>
                </nav>
                <div className="rehome">
                    <h1 className="rehome_h1">Appointment List</h1>
                    <div className="rehome_container">
                        {appointments.map(appointment => (
                            <div key={appointment.id} className="appointment_outerbox">
                                <div className="appointment_innterbox">
                                    <h1 className="rehome_texth1">{appointment.pet_name}</h1>
                                    <h2 className="rehome_h2">Owner Information: {appointment.appoint_name}</h2>
                                    <h2 className="rehome_h2">Address: {appointment.appoint_address}</h2>
                                    <h2 className="rehome_h2">Your Name: {appointment.appoint_name}</h2>
                                    <h2 className="rehome_h2">Your Number: {appointment.appoint_number}</h2>
                                    <h2 className="rehome_h2">Your Email: {appointment.appoint_email}</h2>
                                </div>
                                <img className="deleteImg" src={Delete} onClick={() => deleteAppoint(appointment.id)} />
                            </div>
                        ))}
                    </div>
                    <div className="space3"></div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
