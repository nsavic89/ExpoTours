import { Button, Result } from "antd"
import { Link } from "react-router-dom"



export default function Success() {
    return(
        <div className='mymessage'>
           <Result
                status="success"
                title="Votre demande a été envoyée avec succès"
                subTitle="Veuillez vérifier si vous avez reçu un email de confirmation"
                extra={[
                    <Link to='/'>
                        <Button type="primary" key="console">
                            Revenir à l'accuil
                        </Button>
                    </Link>
                ]}
            />
        </div>
    )
}