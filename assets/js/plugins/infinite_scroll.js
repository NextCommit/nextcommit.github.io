$(function() {

  var postURLs,
    isFetchingPosts = false,
    shouldFetchPosts = true,
    postsToLoad = $(".post-list").children().length;

  // Load the JSON file containing all URLs
  $.getJSON('/search.json', function(data) {
    postURLs = data;

    // If there aren't any more posts available to load than already visible, disable fetching
    if (postURLs.length <= postsToLoad)
      disableFetching();
  });

  // If there's no spinner, it's not a page where posts should be fetched
  if ($(".infinite-spinner").length < 1)
    shouldFetchPosts = false;

  // Are we close to the end of the page? If we are, load more posts
  $(".infinite-spinner").click(function(e){
    if (!shouldFetchPosts || isFetchingPosts) return;

     fetchPosts();
  });

  // Fetch a chunk of posts
  function fetchPosts() {
    // Exit if postURLs haven't been loaded
    if (!postURLs) return;

    isFetchingPosts = true;

    // Load as many posts as there were present on the page when it loaded
    // After successfully loading a post, load the next one
    var loadedPosts = 0,
      postCount = $(".post-list").children().length,
      callback = function() {
        loadedPosts++;
        var postIndex = postCount + loadedPosts;

        if (postIndex > postURLs.length-1) {
          disableFetching();
          return;
        }

        if (loadedPosts < postsToLoad) {
          fetchPostWithIndex(postIndex, callback);
        } else {
          isFetchingPosts = false;
        }
      };

    fetchPostWithIndex(postCount + loadedPosts, callback);
  }

  function fetchPostWithIndex(index, callback) {
    var post = postURLs[index];

  var too_add = "<li><article>" +
    "<a href=\" "+ post.link + "\">" + post.title +
    "  <span class=\"entry-date\"><time>" + post.date + "</time></span>" +
  "<span class=\"excerpt\"> "+ post.excerpt + "</span>" +
  "</a>" +
    "</article></li>";

    $( ".posts-to-add" ).append( too_add );

    callback();
  }

  function disableFetching() {
    shouldFetchPosts = false;
    isFetchingPosts = false;
    $(".infinite-spinner").fadeOut();
  }

});
