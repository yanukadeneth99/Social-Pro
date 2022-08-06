class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    $(" .delete-comment-button", this.postContainer).each(function() {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: "post",
        url: "/comments/createcomment",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));

          new ToggleLike($(' .toggle-like-button' , newComment));

          flash("success", "Nice : You commented");
        },
        error: function (error) {
          console.error(error.responseText);
          flash("error", "Shit: Something went wrong");
        },
      });
    });
  }

  newCommentDom(comment) {
    // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
    return $(`
        <li id="comment-${comment._id}" class="eachcomment-container">
            <p>${comment.user.name}</p>
            <input type="text" value="${comment.content}" disabled></input>
      
             <a class="delete-comment-button" href="/comments/deletecomment/${comment._id}">Delete Comment</a>

             <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">0 Likes</a>
        </li> 
        `
    );
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          flash("success", "Nice : Comment Deleted!");
        },
        error: function (error) {
          console.error(error.responseText);
          flash("error", "Shit : Something went wrong")
        },
      });
    });
  }
}