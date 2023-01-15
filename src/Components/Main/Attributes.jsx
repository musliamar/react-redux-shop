import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../../Store';

function Attributes({
  attributes: arrayOfAttributes, choosenAttributesFromCart, from, inStock,
}) {
  const dispatch = useDispatch();
  const attributesFromState = useSelector((state) => state.choosenAttributes);

  const selectAttribute = ({ id, item }) => {
    const newArray = [];

    attributesFromState.forEach((key) => {
      if (Object.keys(key)[0] === id) {
        newArray.push({ [id]: item });
      } else {
        newArray.push({ [Object.keys(key)[0]]: Object.values(key)[0] });
      }
    });
    dispatch(update({ name: 'choosenAttributes', value: newArray }));
  };

  return (arrayOfAttributes && arrayOfAttributes.map((attribute) => {
    const newAttribute = JSON.parse(JSON.stringify(attribute));
    let selectingEnabled = false;
    const choosenAttributes = from === 'product-page' ? attributesFromState : choosenAttributesFromCart;

    if (from === 'product-page') { selectingEnabled = inStock && true; }

    const { id } = attribute;
    const foundSingle = Object.values(choosenAttributes)
      .find((singleAttribute) => singleAttribute[id]);

    newAttribute.selectedValue = foundSingle[id];

    const {
      id: attributeId, name, items, type, selectedValue,
    } = newAttribute;
    const { id: valueId } = selectedValue;

    return (
      <div key={attributeId} className="attribute">
        <span className={inStock ? 'attribute-name' : 'attribute-name bleached-text'}>
          {name}
          :
        </span>
        <div className="attribute-options">
          {items && items.map((item) => {
            const { id: itemId, value } = item;
            const isSelectedSwatch = (selectedValue && itemId === valueId)
              ? (
                <span
                  key={itemId}
                  style={selectingEnabled ? { cursor: 'pointer', backgroundColor: value } : { backgroundColor: value }}
                  role="button"
                  aria-label="Attribute option"
                  tabIndex={0}
                  onKeyUp={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  onClick={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  className={inStock ? 'attribute-option swatch selected' : 'attribute-option swatch opacity'}
                />
              )
              : (
                <span
                  key={itemId}
                  style={selectingEnabled ? { cursor: 'pointer', backgroundColor: value } : { backgroundColor: value }}
                  role="button"
                  aria-label="Attribute option"
                  tabIndex={0}
                  onKeyUp={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  onClick={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  className={inStock ? 'attribute-option swatch' : 'attribute-option swatch opacity'}
                />
              );

            const isSelectedText = (selectedValue && itemId === valueId)
              ? (
                <span
                  key={itemId}
                  style={selectingEnabled ? { cursor: 'pointer' } : null}
                  role="button"
                  aria-label="Attribute option"
                  tabIndex={0}
                  onKeyUp={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  onClick={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  className={inStock ? 'attribute-option text selected' : 'attribute-option text out-of-stock'}
                >
                  {value}
                </span>
              )
              : (
                <span
                  key={itemId}
                  style={selectingEnabled ? { cursor: 'pointer' } : null}
                  role="button"
                  aria-label="Attribute option"
                  tabIndex={0}
                  onKeyUp={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  onClick={selectingEnabled
                    ? () => selectAttribute({ id: attributeId, item })
                    : null}
                  className={inStock ? 'attribute-option text' : 'attribute-option text out-of-stock'}
                >
                  {value}
                </span>
              );
            return (
              type === 'swatch' ? isSelectedSwatch : isSelectedText
            );
          })}
        </div>
      </div>
    );
  }));
}

export default Attributes;
