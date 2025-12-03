import React from 'react';
import AlphabetCard from './AlphabetCard';
import alphabetData from '../data/alphabet.json';

const AlphabetPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Alphabet Chart</h2>
          <p className="text-gray-500">Click a letter to hear its pronunciation.</p>
       </div>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {alphabetData.map(l => <AlphabetCard key={l.letter} letter={l} />)}
       </div>
    </div>
  );
};

export default AlphabetPage;
