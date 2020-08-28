import React, { useState } from 'react';
import { TypeDefinition, ValueDefinition, ParserField, TypeSystemDefinition } from 'graphql-zeus';
import { NodeAddFieldMenu } from '@Graf/Node/NodeAddFieldMenu';
import { style } from 'typestyle';
import { Plus } from '@Graf/icons/Plus';
import { Interface } from '@Graf/icons/Interface';
import { NodeImplementInterfacesMenu } from '../NodeImplementInterfaceMenu';
import { DetailMenuItem } from '../Menu/DetailMenuItem';
import { Menu } from '../Menu/Menu';
import { MenuScrollingArea } from '../Menu/MenuScrollingArea';
import { More } from '@Graf/icons/More';
import { NodeDirectiveOptionsMenu } from '../NodeDirectiveOptionsMenu';
import { NodeAddDirectiveMenu } from '../NodeAddDirectiveMenu';
import { Monkey } from '@Graf/icons/Monkey';

type PossibleMenus = 'field' | 'interface' | 'directive' | 'options';

const NodeMenuContainer = style({
  position: 'absolute',
  top: 35,
  zIndex: 2,
});

export const TopNodeMenu: React.FC<{ node: ParserField; onTreeChanged: () => void; onDelete: () => void }> = ({
  node,
  onTreeChanged,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState<PossibleMenus>();

  const hideMenu = () => {
    setMenuOpen(undefined);
  };
  return (
    <>
      {node.data.type !== TypeDefinition.ScalarTypeDefinition && node.data.type !== TypeDefinition.EnumTypeDefinition && (
        <div
          className={'NodeIconArea'}
          onClick={() => {
            setMenuOpen('field');
          }}
        >
          <Plus height={10} width={10} />
          {menuOpen === 'field' && (
            <div className={NodeMenuContainer}>
              <NodeAddFieldMenu node={node} onTreeChanged={onTreeChanged} hideMenu={hideMenu} />
            </div>
          )}
        </div>
      )}
      {node.data.type === TypeDefinition.EnumTypeDefinition && (
        <div
          className={'NodeIconArea'}
          onClick={() => {
            node.args = [
              ...(node.args || []),
              {
                data: {
                  type: ValueDefinition.EnumValueDefinition,
                },
                name: 'enumValue' + ((node.args?.length || 0) + 1),
                type: {
                  name: ValueDefinition.EnumValueDefinition,
                },
              },
            ];
            onTreeChanged();
          }}
        >
          <Plus height={10} width={10} />
        </div>
      )}

      {node.data.type === TypeDefinition.ObjectTypeDefinition && (
        <div
          className={'NodeIconArea'}
          onClick={() => {
            setMenuOpen('interface');
          }}
        >
          <Interface height={10} width={10} />
          {menuOpen === 'interface' && (
            <div className={NodeMenuContainer}>
              <NodeImplementInterfacesMenu node={node} onTreeChanged={onTreeChanged} hideMenu={hideMenu} />
            </div>
          )}
        </div>
      )}
      <div
        className={'NodeIconArea'}
        onClick={() => {
          setMenuOpen('directive');
        }}
      >
        <Monkey height={10} width={10} />
        {menuOpen === 'directive' && node.data.type !== TypeSystemDefinition.DirectiveDefinition && (
          <div className={NodeMenuContainer}>
            <NodeAddDirectiveMenu node={node} onTreeChanged={onTreeChanged} hideMenu={hideMenu} />
          </div>
        )}
        {menuOpen === 'directive' && node.data.type === TypeSystemDefinition.DirectiveDefinition && (
          <div className={NodeMenuContainer}>
            <NodeDirectiveOptionsMenu node={node} onTreeChanged={onTreeChanged} hideMenu={hideMenu} />
          </div>
        )}
      </div>
      <div
        className={'NodeIconArea'}
        onClick={() => {
          setMenuOpen('options');
        }}
      >
        <More height={10} width={10} />
        {menuOpen === 'options' && (
          <div className={NodeMenuContainer}>
            <Menu hideMenu={hideMenu}>
              <MenuScrollingArea>
                <DetailMenuItem onClick={onDelete}>Delete node</DetailMenuItem>
                <DetailMenuItem onClick={onDelete}>Duplicate node</DetailMenuItem>
              </MenuScrollingArea>
            </Menu>
          </div>
        )}
      </div>
    </>
  );
};