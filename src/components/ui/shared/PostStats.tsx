
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import type { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
type PostStatsProps ={
    post?: Models.Document;
    userId: string
}
const PostStats = ({post, userId}:PostStatsProps) => {

    const likeList = post?.likes.map((user: Models.Document)=> user.$id);
    

    const [likes, setLikes] = useState(likeList);
    const [isSaved, setIsSaved] = useState(false);

    const {data: currentUser} = useGetCurrentUser()
    const savedPostRecord = currentUser?.save.find((record: Models.Document)=> record.post.$id === post?.$id)

    const {mutate: likePost} = useLikePost();
    const {mutate: savePost, isPending: isSavingPost} = useSavePost();
    const {mutate: deleteSavedPost, isPending: isDeletingPost} = useDeleteSavedPost();


    const handleLikePost = (e: React.MouseEvent)=>{
        e.stopPropagation();

        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId)
        if(hasLiked){
            newLikes = newLikes.filter((id) => id!==userId)
        }
        else{
            newLikes.push(userId)
        }

        setLikes(newLikes);
        likePost({postId: post?.$id || '', likesArray: newLikes})

    }
    const handleSavePost = (e: React.MouseEvent)=>{
        e.stopPropagation();
        
        if(savedPostRecord){
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        }
        else{
            savePost({postId: post?.$id || '', userId: userId})
            setIsSaved(true)
        }



    }



    useEffect(()=>{
        setIsSaved(!!savedPostRecord)
    },[currentUser])
  return (
    <div className="flex justify-between items-center z-20">

        <div className="flex gap-2 mr-5">
            <img
            src={checkIsLiked(likes, userId)? "/assets/icons/liked.svg":"/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2 mr-5">
            {isSavingPost || isDeletingPost ? <Loader/>: 
            <img
            src={isSaved? "/assets/icons/saved.svg":"/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
            />}
            
        </div>
    </div>
  )
}

export default PostStats