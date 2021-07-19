// function activates on form submission
function dataOutput(){
    // returns the array of formdata with name-value KV pairs
    var formData = $('form').serializeArray(); 
    console.log(formData);

    // returns an array of subject marks distribution, 80 = 80:20 distribution and 70 = 70:30 distribution
    var subjectDistribution = [];
    for(let i=4; i<15; i+=2){
        subjectDistribution.push(parseInt(formData[i].value))};
    console.log(subjectDistribution);
    
    // returns an array of class 11 scores
    var elevenScores = [];
    for(let i=3; i<14; i+=2){
        elevenScores.push(parseInt(formData[i].value))};
    console.log(elevenScores);
    
    // returns an array of class 12 scores
    var tweleveScores = [];
    for(let i=15; i<21; i++){
        tweleveScores.push(parseInt(formData[i].value))};
    console.log(tweleveScores);

    // returns an array of practical scores
    var practicalScores = [];
    for(let i=21; i<27; i++){
        practicalScores.push(parseInt(formData[i].value))};
    console.log(practicalScores);

    // data validation
    var dataValid = true;
    // class 10 validation
    for(let i=0; i<3; i++){
        if(80 < formData[i].value || formData[i].value < 0 || formData[i].value == ""){
            dataValid = false
        }
    };
    // class 11, 12 and practical validation
    for(let i=0; i<6; i++){
        if(dataValid == false){
            break
        }
        else if(subjectDistribution[i] == 80){
            if(80 < elevenScores[i] || elevenScores[i] < 0 || Object.is(elevenScores[i], NaN) 
            || 80 < tweleveScores[i] || tweleveScores[i] < 0 || Object.is(tweleveScores[i], NaN)
            || 20 < practicalScores[i] || practicalScores[i] < 0 || Object.is(practicalScores[i], NaN)){
                dataValid = false
            }
        }
        else{
            if(70 < elevenScores[i] || elevenScores[i] < 0 || Object.is(elevenScores[i], NaN) 
            || 70 < tweleveScores[i] || tweleveScores[i] < 0 || Object.is(tweleveScores[i], NaN)
            || 30 < practicalScores[i] || practicalScores[i] < 0 || Object.is(practicalScores[i], NaN)){
                dataValid = false
            }
        }
    };
    console.log(dataValid);

    if(dataValid){

        // base score calculation with class 10 scores
        var baseTotal = 0;
        for(let i=0; i<3; i++){
            baseTotal += parseInt(formData[i].value)};
        var baseScore = Math.round(baseTotal/3);
        console.log(baseTotal);
        console.log(baseScore);
        // for subjects with 70:30 distribution
        var baseScoreSeventy = Math.round((baseScore/80)*21); 
        // for subjects with 80:20 distribution
        var baseScoreEighty = Math.round((baseScore/80)*24); 
        console.log(baseScoreSeventy);
        console.log(baseScoreEighty);

        // final scores calculation
        var finalScores = []
        for(let i=0; i<6; i++){
            if(subjectDistribution[i] == 80){
                let theoryTotal = subjectDistribution[i];
                let elevenSubjectScore = (elevenScores[i]/theoryTotal)*24;
                let tweleveSubjectScore = (tweleveScores[i]/theoryTotal)*32;
                let finalSubjectScore = Math.round(baseScoreEighty + elevenSubjectScore + tweleveSubjectScore + practicalScores[i]);
                finalScores.push(finalSubjectScore)
            }
            else {
                let theoryTotal = subjectDistribution[i];
                let elevenSubjectScore = (elevenScores[i]/theoryTotal)*21;
                let tweleveSubjectScore = (tweleveScores[i]/theoryTotal)*28;
                let finalSubjectScore = Math.round(baseScoreSeventy + elevenSubjectScore + tweleveSubjectScore + practicalScores[i]);
                finalScores.push(finalSubjectScore)
            }
        }
        console.log(finalScores);

        // aggregate percentage calculation
        var totalFinalScore = 0;
        finalScores.forEach(score => totalFinalScore += score);
        var aggregatePercentage = Math.round((totalFinalScore/600)*100);
        console.log(totalFinalScore);
        console.log(aggregatePercentage);
        
        // pass or fail determination 
        var passed = true;
        var failedSubjects = [];
        for(let i=0; i<6; i++){
            if(finalScores[i] < 33){
                let failedSubjectName = undefined;
                if(i==0){
                    failedSubjectName = `Language`;
                    failedSubjects.push(failedSubjectName)
                }
                else{
                    failedSubjectName = `Subject ${i+1}`
                    failedSubjects.push(failedSubjectName)
                };
                passed = false
            }
        }
        var studentPassOrFail = "<b><a>FAILED</a></b><br>You may have failed in some of your subjects!";
        if(passed){
            studentPassOrFail = "<b><a>PASSED</a></b><br>Congratulations! You have passed in all of your subjects!";
            failedSubjects = null
        }
        console.log(passed);
        console.log(failedSubjects);
        console.log(studentPassOrFail);

        // returning processed data as HTML for user
        var content = 
        `<table class="u-full-width">
        <thead>
        <tr>
            <th>Subjects</th>
            <th>Marks Obtained</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Language</td>
            <td>${finalScores[0]}</td>
        </tr>
        <tr>
            <td>Subject 2</td>
            <td>${finalScores[1]}</td>
        </tr>
        <tr>
            <td>Subject 3</td>
            <td>${finalScores[2]}</td>
        </tr>
        <tr>
            <td>Subject 4</td>
            <td>${finalScores[3]}</td>
        </tr>
        <tr>
            <td>Subject 5</td>
            <td>${finalScores[4]}</td>
        </tr>
        <tr>
            <td>Subject 6</td>
            <td>${finalScores[5]}</td>
        </tr>
        </tbody>
        </table>
        <h3>Aggregate Percentage - ${aggregatePercentage}%</h3>
        <h4>${studentPassOrFail}</h4>`;
        $('#calculatedScores').html(content);

        // returning failed subjects list if user has failed
        if(failedSubjects != null){
            $('#calculatedScores').append(`<h4>Subjects Failed -</h4>`);
            $('#calculatedScores').append(`<ol id="failedSubjects"></ol>`);
            failedSubjects.forEach(subject => {
                let listElement = `<b><li>${subject}</li></b>`;
                $('#failedSubjects').append(listElement)
            });
        }

        // resets the form
        $('form').trigger("reset")
    }
    else{
        // alerts the user about form invalidity
        alert("INVALID MARKS \nONE OR MORE OF YOUR MARKS WERE NOT VALID \nPLEASE REVIEW AND ENTER VALID MARKS")
    };
}