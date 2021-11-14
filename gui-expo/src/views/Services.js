import MainLayout from '../components/MainLayout'
import '../styles/home.css'


export default function Services() {

    return (
        <MainLayout>
            <div className='main' style={{ fontSize: 16 }}>
                <div className='shadowBoxDiv' style={{ marginTop: 50 }}>
                    <h1>
                        Prestations
                    </h1>

                    <h3 style={{color: 'white'}}><u>Transports de voyageurs</u></h3>

                    <ul>
                        <li>Tout est étudié pour vous apporter le plus grand confort et la plus grande sécurité</li>
                        <li>Les autocars ExpoTours.ch : des moyens de transport sûrs, que ce soit pour vos trajets de proximité ou vos voyages de longue distance !</li>
                        <li>Particuliers, professionnels, comités d’entreprise, agences de voyage, associations, nous assurons et organisons vos sorties vers les destinations de votre choix.</li>
                    </ul>

                    <h3 style={{color: 'white'}}><u>
                        Nous nous engageons au quotidien pour vous assurer :
                    </u></h3>

                    <ul>
                        <li>Un service de qualité et ponctuel</li>
                        <li>Des conseils pour tous vos déplacements</li>
                        <li>Des chauffeurs expérimentés</li>
                        <li>Des véhicules fiables et confortables</li>
                        <li>Transports scolaires et de personnel</li>
                        <li>Pour vos transports scolaires et de personnel, choisissez la sécurité des autocars ExpoTours.ch !</li>
                    </ul>

                    <h3 style={{color: 'white'}}><u>
                        Nous assurons :
                    </u></h3>

                    <ul>
                        <li>Des transports scolaires</li>
                        <li>Des transports périscolaires (sorties pédagogiques, classes de neige, sorties culturelles et sportives…)</li>
                        <li>Nous sommes très attentifs au respect des normes de sécurité et aux normes environnementales. Tous nos véhicules sont soumis à des contrôles techniques très régulièrement et font l’objet d’un entretien rigoureux</li>
                        <li>Les autocars ExpoTours.ch vous proposent une étude personnalisée de votre plan de déplacement. </li>
                    </ul>

                    <h3 style={{color: 'white'}}><u>
                        Nos conducteurs
                    </u></h3>

                    <p>
                        La fonction de conducteur dans une entreprise de transport de voyageurs, revêt le plus souvent des aspects forts différents. Pour l’homme de la rue, le non initié, quel point commun peut-il donc y avoir entre le conducteur qui assure du transport d’écoliers ou d’ouvriers et le conducteur qui promène un groupe de touristes à travers l’Europe ? Et pourtant !
                    </p>
                </div>
            </div>
        </MainLayout>
    )
}