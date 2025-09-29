import List from './List';
import React from 'react'
import { Link } from 'react-router-dom';
import ListContainer from './ListContainer';

const GalleryGrid = () => {
  return (
    <ListContainer className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 px-6">
      <List className="bg-zinc-900 h-[400px]  rounded-md">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900 h-[400px] rounded-md  ">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900  h-[400px] rounded-md ">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900 h-[400px] rounded-md  ">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900 h-[400px] rounded-md  ">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900  h-[400px] rounded-md ">
        <Link to={""} />
      </List>
      <List className="bg-zinc-900  h-[400px] rounded-md">
        <Link to={""} />
      </List>
    </ListContainer>
  );
}

export default GalleryGrid