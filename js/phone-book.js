var students = [];
var editId;

// TODO edit API url's & ACTION_METHODS
const API = "//localhost:8091/students/";

const ACTION_METHODS = {
    CREATE: "POST",
    READ: "GET",
    UPDATE: "PUT",
    DELETE: "DELETE"
};

window.PhoneBook = {
    getRow: function(student) {
        // ES6 string template

        return `<tr>
            <td>${student.id}</td>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.courseEnrolment}</td>
            <td>${student.courseGroup}</td>
            <td>
                <a href='#' data-id='${student.id}' class='delete'>&#10006;</a>
                <a href='#' data-id='${student.id}' class='edit'>&#9998;</a>
            </td>
        </tr>`;
    },

    load: function () {
        $.ajax({
            url: API,
            method: ACTION_METHODS.READ
        }).done(function (students) {
            console.info('done:',students);
            PhoneBookLocalActions.load(students.content);
            PhoneBook.display(students);
        });
    },


    delete: function (id) {
        var id = id;
        $.ajax({
            url: API+id,
            method: ACTION_METHODS.DELETE,
            data: JSON.stringify(id),
            contentType: "application/json",
        }).done(function () {
                PhoneBookLocalActions.delete(id);
                location.reload();
        });
    },

    add: function(student) {

        $.ajax({
            url: API,
            method: ACTION_METHODS.CREATE,
            data: JSON.stringify(student),
            contentType: "application/json",
        }).done(function () {
                PhoneBook.cancelEdit();
                PhoneBookLocalActions.add(student);
                location.reload();
        });
    },

    update: function(student) {
        var id = student.id;
        $.ajax({
            url: API+id,
            method: ACTION_METHODS.UPDATE,
            data: JSON.stringify(student),
            contentType: "application/json",
        }).done(function () {
                PhoneBook.cancelEdit();
                PhoneBookLocalActions.update(student);
                location.reload();
        });
    },

    bindEvents: function() {
        $('#phone-book tbody').delegate('a.edit', 'click', function (event) {
            event.preventDefault();
            var id = $(this).data('id');
            PhoneBook.startEdit(id);
        });

        $('#phone-book tbody').delegate('a.delete', 'click', function () {
            var id = $(this).data('id');
            console.info('click on ', this, id);
            PhoneBook.delete(id);
        });

        $(".add-form").submit(function() {
            const student = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                courseEnrolment: $('input[name=courseEnrolment]').val(),
                courseGroup: $('input[name=courseGroup]').val()
            };

            if (editId) {
                student.id = editId;
                PhoneBook.update(student);
            } else {
                PhoneBook.add(student);
            }
        });

        document.getElementById('search').addEventListener('input', function(ev) {
            //const value = document.getElementById('search').value;
            const value = this.value;
            PhoneBook.search(value);
        });
        document.querySelector('.add-form').addEventListener('reset', function(ev) {
            PhoneBook.search("");
        });
    },

    startEdit: function (id) {
        // ES5 function systax inside find
        let editStudent = students.find(function (student) {
            console.log(student.firstName);
            return student.id == id;
        });
        console.debug('startEdit', editStudent);

        $('input[name=firstName]').val(editStudent.firstName);
        $('input[name=lastName]').val(editStudent.lastName);
        $('input[name=courseEnrolment]').val(editStudent.courseEnrolment);
        $('input[name=courseGroup]').val(editStudent.courseGroup);
        editId = id;
    },

    cancelEdit: function() {
        editId = '';
        document.querySelector(".add-form").reset();
    },

    display: function(students) {
        var rows = '';

        // ES6 function systax inside forEach
      students.content.forEach(student => rows += PhoneBook.getRow(student));
        $('#phone-book tbody').html(rows);
    },

    search: function (value) {
        value = value.toLowerCase();

        var filtered = students.filter(function (student) {
            return student.firstName.toLowerCase().includes(value) ||
                student.lastName.toLowerCase().includes(value) ||
                student.courseEnrolment.toLowerCase().includes(value) ||
                student.courseGroup.toLowerCase().includes(value);
        });

        var rows = '';
        filtered.forEach(student => rows += PhoneBook.getRow(student));
        $('#phone-book tbody').html(rows)

    }
};


// ES6 functions
window.PhoneBookLocalActions = {
    load: (students) => {
        // save in persons as global variable
        window.students = students;
    },
    // ES6 functions (one param - no need parantheses for arguments)
    add: student => {
        student.id = new Date().getTime();
        students.push(student);

    },
    delete: id => {
        var remainingStudents = students.filter(student=> student.id !== id);
        window.students = remainingStudents;
    },
    update: student => {
        var id = student.id;
        var studentToUpdate = students.find(student => student.id === id);
        studentToUpdate.firstName = student.firstName;
        studentToUpdate.lastName = student.lastName;
        studentToUpdate.courseEnrolment = student.courseEnrolment;
        studentToUpdate.courseGroup = student.courseGroup;
    }
}

console.info('loading students');
PhoneBook.load();
PhoneBook.bindEvents();