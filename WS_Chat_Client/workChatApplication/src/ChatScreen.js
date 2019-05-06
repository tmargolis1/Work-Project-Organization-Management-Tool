import React from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import WhosOnlineList from './components/WhosOnlineList'


class ChatScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            currentRoom: {},
            messages: [],
            currentUser: {},
            usersWhoAreTyping: [],

        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
    }


    componentDidMount () {
        const chatManager = new Chatkit.ChatManager ({
            instanceLocator: 'v1:us1:5d804c1c-f7cc-4f8b-a31d-bd201c076298',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url:'http://localhost:3001/authenticate',
            }),
        })
     
     
    chatManager
        .connect()
        .then(currentUser => {
            this.setState({ currentUser })
        return currentUser.subscribeToRoom({
          roomId: "19406903",
          messageLimit: 100,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message],
              })
            },
            onUserStartedTyping: user => {
                this.setState({
                    usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                })
            },
                onUserStoppedTyping: user => {
                    this.setState({
                        usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                        username => username !== user.name
               ),
             })
           },
           onPresenceChange: () => this.forceUpdate(),
          },
        })
      }).then(currentRoom => {
          this.setState({ currentRoom })
      })
        .catch(error => console.error(error))

    }

    //Methods
    sendMessage(text) {
        this.state.currentUser.sendMessage({
         roomId: this.state.currentRoom.id,
         text
        })
    }
   
    sendTypingEvent() {
        this.state.currentUser
        .isTypingIn({roomId: this.state.currentRoom.id})
        .catch(error => console.error('error', error))
    }


    render() {
        
        //styling
    const styles = {
        container: {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        chatContainer: {
          display: 'flex',
          flex: 1,
          backgroundColor: '#b7bbbc',
        },
        whosOnlineListContainer: {
          width: '300px',
          flex: 'none',
          padding: 20,
          backgroundColor: '#3e99b2',
          color: 'white',
        },
        chatListContainer: {
          padding: 20,
          width: '85%',
          display: 'flex',
          flexDirection: 'column',
        },
     }

     return (
        <div style={styles.container}>>
          <div style={styles.chatContainer}>
            <aside style={styles.whosOnlineListContainer}>
            <h2>Users Online</h2>
            <WhosOnlineList
                currentUser={this.state.currentUser}
                users={this.state.currentRoom.users} />
            </aside>
            <section style={styles.chatListContainer}>
            <h2>Chatroom Messages</h2>
              <MessageList
                messages={this.state.messages}
                style={styles.chatList}
              />
             <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
              <SendMessageForm
                onSubmit={this.sendMessage}
               onChange={this.sendTypingEvent}
              />
            </section>
          </div>
        </div>
      )
    }
  }

export default ChatScreen