function Toast({ message, type }) {

const background =
type === "error"
? "#ef4444"
: "#8B5CF6";

return (

<div style={{
position:"fixed",
top:"30px",
right:"30px",
background,
color:"white",
padding:"14px 24px",
borderRadius:"10px",
boxShadow:"0 10px 25px rgba(0,0,0,0.4)",
fontSize:"14px",
zIndex:9999,
animation:"slideIn 0.3s ease"
}}>

{message}

</div>

);

}

export default Toast;