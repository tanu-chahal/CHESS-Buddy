const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomCode = '';
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters.charAt(randomIndex);
    }
  
    return roomCode
  }
  
  export default generateRoomCode