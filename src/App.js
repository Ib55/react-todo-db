import React, { useEffect, useState } from 'react'

const App = () => {
const [todoTitle,setTodoTitle] = useState('')
const [todoList,setTodoList] = useState([])
const [isEditMode,setIsEditMode] = useState(false)
const [update,setUpdate] = useState(null)
const inputHandler=(e)=>{
  setTodoTitle(e.target.value)
}
const createHandler=(e)=>{
  e.preventDefault()
  if(todoTitle!==''){
    const newTodo={
      id:Date.now(),
      title:todoTitle
    }
    fetch('http://localhost:3000/todos',{
      method:'POST',
      body:JSON.stringify(newTodo),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then(data=>{
      fetch('http://localhost:3000/todos')
      .then(response=>response.json())
      .then(data=>{
        setTodoList(data)
        setTodoTitle('')
      })
    })
  }else{
    alert('Please Fill The Form')
  }
}
const deleteHandler=(id)=>{
  // const deleteTodo = todoList.filter(item=>item.id!==id)
  // setTodoList(deleteTodo)
  const tobeDelete = todoList.find(item=>item.id===id)
  fetch(`http://localhost:3000/todos/${tobeDelete.id}`,{
    method:'DELETE'
  })
  .then(response=>response.json())
  .then(()=>{
    fetch('http://localhost:3000/todos')
    .then(response=>response.json())
    .then(data=>setTodoList(data))
  })
}
const editHandler=(id)=>{
  const editTodo = todoList.find(item=>item.id===id)
  setIsEditMode(true)
  setUpdate(editTodo)
  setTodoTitle(editTodo.title)
}
const UpdateHandler=(e)=>{
  e.preventDefault()
  fetch(`http://localhost:3000/todos/${update.id}`,{
    method:'PATCH',
    body:JSON.stringify({
      title:todoTitle
    }),
    headers:{
      'Content-Type':'application/json'
    }
  })
  .then(response=>response.json())
  .then(()=>{
    fetch('http://localhost:3000/todos')
    .then(response=>response.json())
    .then(data=>{
      setTodoList(data)
      setTodoTitle('');
      setIsEditMode(false);
      setUpdate(null)
      
    })
  })

  
}
useEffect(()=>{
  fetch('http://localhost:3000/todos')
  .then(response=>response.json())
  .then(data=>setTodoList(data))
})
  return (
    <div>
      <form>
        <input onChange={(e)=>inputHandler(e)} value={todoTitle}/>
        <button onClick={(e)=>isEditMode===true?UpdateHandler(e):createHandler(e)}>{isEditMode?'Update Todo':'Add Todo'}</button>
      </form>
      <ul>
        {
          todoList.map((item)=><li key={item.id}>{item.title} <button onClick={()=>deleteHandler(item.id)}>Delete</button>  <button onClick={()=>editHandler(item.id)}>Edit</button></li>)
        }
      </ul>
    </div>
  )
}

export default App