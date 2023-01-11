import { useState } from 'react';

export default function useModal() {

  const [modalIsShowing, setIsShowing] = useState(false);

  function modalToggle() {
    setIsShowing(!modalIsShowing);
  }

  return {
    modalIsShowing,
    modalToggle,
  }

}

