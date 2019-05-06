import React from 'react'

class SendMessageForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text:''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e){ 
        this.setState({ text: e.target.value})
        if (this.props.onChange) {
            this.props.onChange()
        }
        this.props.onChange()
    }


    onSubmit(e){
        e.preventDefault() 
        this.props.onSubmit(this.state.text)
        this.setState({ text: '' })
    }

//create control component
    render(){
        const styles = {
                   container: {
                     padding: 20,
                     borderTop: '1px #4C758F solid',
                     marginBottom: 20,
                   },
                   form: {
                     display: 'flex',
                   },
                   input: {
                     color: 'inherit',
                     background: 'none',
                     outline: 'none',
                     border: 'none',
                      flex: 1,
                     fontSize: 16,
                   },
                 }
                 return (
                   <div style={styles.container}>
                     <div>
                       <form onSubmit={this.onSubmit} style={styles.form}>
                         <input
                           type="text"
                           placeholder="Type your message here..."
                           onChange={this.onChange}
                           value={this.state.text}
                           style={styles.input}
                         />
                         <input type='submit'/>
                       </form>
                     </div>
                   </div>
        )
    }
}

export default SendMessageForm