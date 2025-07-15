import React, { useState, useEffect } from 'react';

function Checkout() {
  const [ingresso, setIngresso] = useState(null);
  
  useEffect(() => {
    // Código para buscar o ingresso selecionado
  }, []);

  const handlePagamento = async () => {
    // Lógica de integração com o Asaas para realizar o pagamento
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <p>Evento: {ingresso?.evento?.nome}</p>
        <p>Valor: R${ingresso?.valor_unitario}</p>
        <button onClick={handlePagamento}>Pagar</button>
      </div>
    </div>
  );
}

export default Checkout;
