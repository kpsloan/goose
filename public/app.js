// Show comment
function showcomment(event) {
	event.preventDefault();
	var id = $(this).attr("value");
	$("#addcomment").fadeIn(300).css("display", "flex");
	$("#add-comment").attr("value", id);
	$.get("/" + id, function(data) {
		$("#article-title").text(data.title);
		$.get("/comment/" + id, function(data) {
			if (data) {
				$("#comment-title").val(data.title);
				$("#comment-body").val(data.body);
			}
		});
	});

}


// Add comment
function addcomment(event) {
	event.preventDefault();
//	var id = $(this).attr("value");
	var obj = {
		title: $("#comment-title").val().trim(),
		body: $("#comment-body").val().trim(),
		articleid: $("#article-id").val().trim()
	};
	$.post("/comment/" + $("#article-id").val().trim(), obj, function(data) {
		window.location.href = "/saved";
	});
}

function horriblehack() {
	$("#article-id").val($(this).attr('value'));
}
// Change article status
function changestatus() {
	var status = $(this).attr("value");
	if (status === "Saved") {
		$(this).html("Unsave");
	}
};

function changeback() {
	$(this).html($(this).attr("value"));
}


// Functionality
$(document).on("click", ".showcomment-button", showcomment);
$(document).on("click", "#add-comment", addcomment);

$(document).on("click", ".addcomment-button", horriblehack)

$(".status").hover(changestatus, changeback);
$("#close-comment").on("click", function() {
	$("#addcomment").fadeOut(300);
});