import { Avatar, Comment } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

// eslint-disable-next-line react/display-name
export default function Comments() {
  return (
    <Comment
      author={(<a>Han Solo</a>) as JSX.Element}
      avatar={<Avatar size={48} icon={<FontAwesomeIcon icon={faUser} />} />}
      content={
        <p>
          We supply a series of design principles, practical patterns and high
          quality design resources (Sketch and Axure), to help people create
          their product prototypes beautifully and efficiently.
        </p>
      }
    />
  )
}
