{
  // Send Ajax request to make a new post, and get back post and user info
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/createpost",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          new PostComments(data.data.post._id); 
          
          new ToggleLike($(' .toggle-like-button', newPost));
          
          flash("success", "Nice : Created a post!");
        },
        error: function (error) {
          console.error(`Error sending data : ${error.responseText}`);
          flash("error", "Shit : Error when creating post");
        },
      });
    });
  };

  // Creating a Post DOM Object
  let newPostDom = function (post) {
    return $(
      `
      <!--Each Post-->
      <li id="post-${post._id}" class="eachpost-container">
      
        <div class="eachpost-header">
          <h4 class="eachpost-header-name">${post.user.name}</h4>
          <p class="eachpost-header-date">${post.createdAt}</p>
        </div>
      
        <div class="eachpost-body">   
          <a class="delete-post-button" href="/posts/deletepost/${post._id}">X</a>
      
          <textarea name="content" cols="30" rows="15" disabled>${post.content}</textarea>
        </div>

        </div>
        <div class="eachpost-bottom">
        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">0 Likes</a>
        </div>
      
        <div class="eachpost-comment-container">
          <form action="/comments/createcomment" id="post-${post._id}-comments-form" method="post">
            <p>${post.user.name}</p>
            <input name="content" type="text" placeholder="Enter your comment here"></input>
            <input type="hidden" name="post" value="${post._id}" />
            <button type="submit">Comment</button>
          </form>
       
      
          <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
            </ul>
          </div>
        </div>
      </li>
      
    `
    );
  };

  // Method to Delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          flash('success', 'Nice : Deleted the post');
        },
        error: function (error) {
          flash('error', 'Shit : Could not delete the post');
          console.error(error.responseText);
        },
      });
    });
  };

  let convertPostsToAjax = function(){
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  }



  createPost();
  convertPostsToAjax();
}
