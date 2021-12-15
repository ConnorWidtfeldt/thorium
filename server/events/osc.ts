import App from "../app";

App.on("oscInvokeMethod", (data) => {
  console.log(data)

  console.log("INVOKE METHOD!!!")
})
