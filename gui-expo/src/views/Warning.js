import { Button, Result } from "antd"
import { Link } from "react-router-dom"



export default function Warning() {
    return(
        <div className='mymessage'>
            <Result
                status="warning"
                title="Un problème s'est réalisé. Veuillez essayer plus tard"
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