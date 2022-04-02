let pageSize = 3;
let baseUrl = `http://78.24.217.179:82/api/feedbacks/getComments`;
let maxPagesCount = 5;
let nextPage = 1;

function CommentModel() {
    return {
        commentText: `test ${nextPage}`,
        commentDate: "test 1",
        userFio: "test 1",
        userAvatarUri: "https://sun9-19.userapi.com/impf/DRCrB7kvz_4de8lL_nFRMAprKCqu4E4ws6FFCg/F88SNF77hZU.jpg?size=1651x2160&quality=96&sign=61971d8c66ac50466b94fefd76562a13&type=album",
        userPageUri: "test 1"
    }
}

let models = []


let updateUserModel = (modelIndex) => {
    let model = models[modelIndex];
    let id = `model_${modelIndex}`;
    let userNameId = `${id}_userName`;
    let commentTextId = `${id}_commentText`;
    let avatarId = `${id}_avatarLink`;
    let commentDateId = `${id}_commentDate`;
    let userUrls = `${id}_userUrl`;

    let userNameElement = document.getElementById(userNameId); 
    let commentTextElement = document.getElementById(commentTextId);
    let avatarElement = document.getElementById(avatarId);
    let dateElement = document.getElementById(commentDateId);
    let userUrlsElement = document.getElementsByClassName(userUrls);
    // console.log(userUrlsElement)
    userNameElement.innerText = model.userFio;
    commentTextElement.innerText = model.commentText;
    avatarElement.src = model.userAvatarUri;
    dateElement.innerText = model.commentDate;
    [].forEach.call(userUrlsElement, function (el) {
        el.href = model.userPageUri;
    });
}

let updateFeedbackList = () => {
    models.forEach((val, index) => {
        updateUserModel(index);
    })
}

let getFeedbackList = (page, action) => {
    let data = {"NumberPage": page, "CommentCount": pageSize};
    var url = new URL(baseUrl)
    for(let k in data) {
        url.searchParams.append(k, data[k])
    }
    console.log(url)
    fetch(url, {
        mode: 'cors'
    })
    .then(response => response.json())
    .then(json => {
        maxPagesCount = json.pagesCount;
        models = json.boardComments;
        action(maxPagesCount);
        updateFeedbackList();
    }).catch((r) => console.log(r))
}

function fakeFetch() {
    return new Promise((resolve, reject) => {
        resolve({
            boardComments: [CommentModel(), CommentModel(), CommentModel()],
            pagesCount: 4
        })
    })
}

function incPage(event) {
    nextPage++;
    getFeedbackList(nextPage, (pages) => {
        maxPagesCount = pages;
        if (maxPagesCount > nextPage) {
            document.getElementById("decPage").classList.remove("disabled")
        } else {
            document.getElementById("incPage").classList.add("disabled")
            document.getElementById("decPage").classList.remove("disabled")
        }
    })
}

function decPage(event) {
    nextPage--;
    getFeedbackList(nextPage, (pages) => {
        maxPagesCount = pages;
        if (nextPage <= 1) {
            nextPage = 1;
            document.getElementById("decPage").classList.add("disabled")
        } else {
            document.getElementById("incPage").classList.remove("disabled")
        }
    });
}

getFeedbackList(1, (pages) => {
    nextPage = 1
})