import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  usePrefetchInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  signOutAccount,
 
  createPost,
  getRecentPosts,
  LikePost,
  savePost,
  deleteSavedPost,
  getCurrentUser,
  getPostById,
  updatePost,
  deletePost,
  getInfinitePosts,
  searchPosts,
 
} from "@/lib/appwrite/api";
import type { INewPost, INewUser, IUpdatePost} from "@/types";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};


export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const useGetRecentPosts = ()=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}



export const useLikePost = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({postId, likesArray}: {postId: string; likesArray: string[]})=>
      LikePost(postId, likesArray),
    onSuccess: (data)=>{
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]

      })
    }
  })
}
export const useSavePost = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({postId, userId}: {postId: string; userId: string})=>
      savePost(userId,postId ),
    onSuccess: ()=>{
     
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]

      })
    }
  })
}


export const useDeleteSavedPost = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (savedRecordId: string)=> deleteSavedPost(savedRecordId),
    onSuccess: ()=>{
     
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]

      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]

      })
    }
  })
}




export const useGetCurrentUser = ()=>{

  return useQuery(
    {
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser
    }
  )
}



export const useGetPostById = (postId: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: ()=>getPostById(postId),
    enabled: !!postId
  })
}
export const useUpdatePost = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post:IUpdatePost)=> updatePost(post),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
    }
  })
}
export const useDeletePost = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({postId, imageId}:{postId: string,imageId: string})=> deletePost(postId,imageId),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}



export const useGetPosts = ()=>{
  return useInfiniteQuery({
    queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    initialPageParam:0,
    getNextPageParam: (lastPage:any)=>{
      if(lastPage && lastPage.documents.length===0) return null;

      const lastId = lastPage.documents[lastPage?.documents.length-1].$id

      return lastId
    }
  })
}


export const useSearchPosts = (searchTerm: string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: ()=>searchPosts(searchTerm),
    enabled: !!searchTerm


  })
}