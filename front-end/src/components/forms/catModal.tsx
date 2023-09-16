//@ts-nocheck
'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

import ReactModal from 'react-modal';
import { updateRes } from '@/functions/reservations';
import { YellowButton, PurpleButton } from '../ui/buttons';

export default function EditCatModal({ id, categories }) {
  const router = useRouter();

  const categoryRef = useRef();
  const hideModal = () => setIsVisible(false);
  const showModal = () => setIsVisible(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const handleSave = async (event) => {
    event.preventDefault();

    const catID: number = categoryRef.current.value;
    await updateRes(id, catID);
    hideModal();
    router.refresh();
  };

  return (
    <>
      <YellowButton onClick={showModal}>Change Category</YellowButton>
      <ReactModal
        className="fixed inset-0 flex text-lg items-center text-black dark:text-black justify-center z-50 transition-all ease-in-out duration-1000"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 modal-overlay"
        isOpen={!!isVisible}
      >
        <div className="bg-white items-center place-content-center   justify-center flex flex-col rounded-lg w-auto min-w-34 p-4">
          <form onSubmit={handleSave}>
            <h2>Change Category</h2>
            <div className="flex flex-col">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" ref={categoryRef}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div>
                <YellowButton type="submit" onClick={handleSave}>
                  Save
                </YellowButton>
                <PurpleButton type="button" onClick={hideModal}>
                  Cancel
                </PurpleButton>
              </div>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
}
