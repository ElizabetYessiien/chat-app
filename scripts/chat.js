class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    //method to add new chat documents

    async addChat(message){
        //format a chat object

        const now = new Date();
        const chat = {
            message : message,
            username:this.username,
            room: this.room,
            created_at : firebase.firestore.Timestamp.fromDate(now)
        }

        //save the chat document

        const response = await this.chats.add(chat);
        return response;
    }

    //regular method not an async one to get chats because it listens everytime
   getChats(callback){
       this.unsub = this.chats
       .where('room', '==', this.room)
       .orderBy('created_at')
       .onSnapshot(snapshot=>{
           //get the document changes and cycle through the array of changes

           snapshot.docChanges().forEach(change=>{
               //check to see if the change is an added type
               if(change.type === 'added'){
                   //update the ui
                   callback(change.doc.data())
               }
           })
       })
   }
   updateName(username){
       this.username = username;
       localStorage.setItem('username', username);
       
   }
   updateRoom(room){
       this.room =room;
       console.log('room updated')
       if(this.unsub){
        this.unsub();
       }
       
   }

}





