import { useEffect, useState } from 'react'
import { getDatabase, ref, set,push, onValue, remove, update } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const db = getDatabase();
  let [text,setText] = useState("")
  let [todo,setTodo] = useState ([])
  let [togglebtn, setToggleBtn] = useState(false)
  let [todoid, setTodoId] = useState()

  let handleForm = (e) => {
    setText(e.target.value);
  }
  // wirte oparetion

  let handleAdd = (e) =>{
    set(push(ref(db, "alltodo")),{
      todoText: text,
    })
    setText("")
  }

  // read oparetion
  useEffect(()=>{
    const todoRef = ref(db, 'alltodo');
    onValue(todoRef, (snapshot) => {
    let arr = []
    snapshot.forEach((item)=>{
    arr.push({...item.val(), id:item.key})
    })
    setTodo(arr)
    });
    },[]) 
  
    // delete oparetion

    let handleDelete = (id) => {
      remove(ref(db,'alltodo/'+id)).then(()=>(
        // console.log("delete successful")
        toast('🦄 Delete successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",          
          })
      ))
    }
    let handleAllDelete = () =>{
      remove(ref(db,'alltodo')).then(()=>(
        // console.log("all delete done")
        toast('🦄 All Delete successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",          
          })
      ))
    }

    // update oparetion

    let handleUpdate = (item)=>{
      setTodoId(item.id)
      setText(item.todoText)
      setToggleBtn(true)
    }

    
    let handleEdit = ()=>{
      console.log(text);
      console.log(todoid);
      update(ref(db, 'alltodo/'+todoid),{
        todoText: text,
      }).then(()=>{
        setToggleBtn(false)
      setText("")
      })      
    }
  

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      
      />
<ToastContainer />
     <div>
     <input onChange={handleForm} value={text} placeholder='enter your text'/>
     {
      togglebtn
      ?
      <button onClick={handleEdit}>Edit</button>
      :
      <button onClick={handleAdd}>Add</button>
     }
     </div>
     <div>
      <button onClick={handleAllDelete}>All Delete</button>
     </div>
     <ul>
      {
        todo.map((item,index)=>(
          <li 
            key={index}>{item.todoText}
            <button onClick={()=>handleDelete(item.id)}>Delete</button>
            <button onClick={()=>handleUpdate(item)}>Update</button>
          </li>
        ))
      }
     </ul>
    </>
  )
}

export default App
