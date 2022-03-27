
// pseudo code 
// movement function: move players on keyboard events <- -> 

//         player1_bar.top < ball.bottom 
//                         |
//                         |
// player1.left< ball.right| player1.right < ball.left
//                         |
//                         |
//     player1_bar.bottom > ball.top 

// 225           315
// (-,-)       (-,+)
//         |
//         |
//         |
//         |
// -----------------
//         |
//         |
//         |
//         |
// (+,-)       (+,+)
// 135           45

//constant 
const TABLE_WIDTH = 600;
const TABLE_HEIGHT = 400;
const FPS = 100; //draw ball 
const ONE_SEC_IN_MS = 1000;

//get event listener for keys 
const player1_bar = document.getElementById("player1")
const player2_bar = document.getElementById("player2")
const ball_circle = document.getElementById("ball_id")
const backdrop_id = document.getElementById("backdrop_id")

const player1_score = document.getElementById("player1_score")
const player2_score = document.getElementById("player2_score")

const max_speed = 5;
const min_speed = 1;
const spd_change = 0.5;
var spd_normal = 1;

const angle_Change = 10;

let State = {
    /** Constant values */
    player1_up: "7",
    player1_down: "1",
    player2_up: "9",
    player2_down: "3",

    shot_key: "5",

    keyPressed:{}, //stores the state of the key pressed

    max_pos: 100, 
    min_pos: 0,

    player1:{
        pos: 0,
        x:3,
        width: 5,
        height: 60,
        score: 0
    },

    player2:{
        pos:0, //donot include the width and height here, just player1's
        x: 3, //TABLE_WIDTH - 3 - player2.width,
        
        width: 5,
        height: 60,
        
        score: 0
    },

    ball: {
        x:0,
        y:0,
        diameter: 20,
        
        angle: 0,
        velX: spd_normal,
        velY: spd_normal
    },

    running: false
};



// function draw_ball(x, y){
//     let r = 20
//     //draw circle 
//     let canvas = document.getElementById("tabCanvas")
//     let draw_ = canvas.getContext('2d')
//     draw_.fillStyle = "red"; 
//     draw_.beginPath(); 
//     draw_.arc(x,y,r,0,Math.PI*2, false); 
//     draw_.closePath(); 
//     draw_.fill();
// }

function init_game()//also used for restarting 
{
    //Set constants of visuals 
    backdrop_id.style.width = TABLE_WIDTH.toString()+"px"
    backdrop_id.style.height = TABLE_HEIGHT.toString()+"px"

    player1_bar.style.width = State.player1.width.toString()+"px"
    player2_bar.style.width = State.player2.width.toString()+"px" //using player1 height on purpose
    
    player1_bar.style.height = State.player1.height.toString()+"px"
    player2_bar.style.height = State.player2.height.toString()+"px" //using player1 height on purpose

    ball_circle.style.height = State.ball.diameter.toString() + "px"
    ball_circle.style.width = State.ball.diameter.toString() + "px"

    State.player2.x = TABLE_WIDTH - 3 - State.player2.width
    player1_bar.style.left = State.player1.x.toString() + "px"
    player2_bar.style.left = State.player2.x.toString() + "px"

    //set value of variables 
    State.ball.x = TABLE_WIDTH/2;
    State.ball.y = TABLE_HEIGHT/2;

    //reset playerpos
    State.player1.pos= TABLE_HEIGHT/2;
    State.player2.pos= TABLE_HEIGHT/2;

    //reset the "running flag"
    State.running= false

    spd_normal = min_speed
    State.ball.angle = 0;
    compute_ball_vel_from_angle()
}

//player: player object
//isLeft: is true if player object is for the left player 
function colliction_check(player, isLeft){
    p_top = player.pos
    p_bottom = player.pos + player.height
    p_left = player.x
    p_right = player.x + player.width

    b_top = State.ball.y
    b_bottom = State.ball.y + State.ball.diameter
    b_left = State.ball.x
    b_right = State.ball.x + State.ball.diameter

    // if (!isLeft) {
    //     console.log("player!!: " +p_top.toString()+" "
    // +p_bottom.toString()+ " "+ p_left.toString() + " " + p_right.toString() 
    // + " ball: " +b_top.toString()+" "+b_bottom.toString()
    // + " "+ b_left.toString() + " " + b_right.toString() )
    // }
    if ( (p_top < b_bottom) && (p_bottom > b_top)){
        if (isLeft) return (p_right > b_left)
        else return (p_left< b_right)  // (p_right < b_left)  add this here if you want player to hit with inner side
    }
    
    return  0
}

function mirror_angle_vertically(angle)
{
    mirrored_Angle = 180 - angle

    if (mirrored_Angle < 0){
        mirrored_Angle = 360 + mirrored_Angle
    }
    return mirrored_Angle
}
function mirror_angle_horizontally(angle){
    return 360 - angle
}

function compute_ball_vel_from_angle(isContactAPlayer = false)
    {
    //check for shot 
    if (isContactAPlayer){
        if (State.keyPressed[State.shot_key]){
            if (spd_normal<max_speed) spd_normal+= spd_change
            console.log(`shot fired: ${spd_normal}`)
        }else if (spd_normal>min_speed) spd_normal-= spd_change
    }
    //knowns: 
    // angle = 30°
    // hypotenuse = 10	opposite = 10*sin(30) = 5
    // adjacent = 10*cos(30) = 8.66
    //Unknowns
    // adj (x), opp (y)
    ang_deg = State.ball.angle
    ang_rad = (ang_deg * Math.PI) / 180 ;
    hyp = spd_normal
    adj = hyp * Math.cos(ang_rad)
    opp = hyp * Math.sin(ang_rad)

    State.ball.velY = opp
    State.ball.velX = adj

    console.log("velx: "+ State.ball.velX + ", velY: " 
    + State.ball.velY+ ", angle: " + State.ball.angle)

    console.log(`adj: ${adj}, opp: ${opp}, hyp: ${hyp}\
    , angle_rad: ${ang_rad}, angle_deg: ${ang_deg}`)

}

function update_score(){
    player1_score.textContent = State.player1.score
    player2_score.textContent = State.player2.score
}

function update_keypress(){
    if (State.keyPressed[State.player1_up]){
        // console.log("Player 1 up, pos: "+State.player1.pos.toString())
        State.player1.pos = (State.player1.pos <= State.min_pos)? State.player1.pos: State.player1.pos-1;
    }else if (State.keyPressed[State.player1_down]){
        // console.log("Player 1 down, pos: "+State.player1.pos.toString())
        State.player1.pos = (State.player1.pos >= ( TABLE_HEIGHT - State.player1.height))? State.player1.pos: State.player1.pos+1;
    }
    if (State.keyPressed[State.player2_up]){
        // console.log("Player 2 up, pos: "+State.player2.pos.toString())
        State.player2.pos = (State.player2.pos <= State.min_pos)? State.player2.pos: State.player2.pos-1;
    }else if (State.keyPressed[State.player2_down]){
        // console.log("Player 2 down, pos: "+State.player2.pos.toString())
        State.player2.pos = (State.player2.pos >= (TABLE_HEIGHT - State.player2.height))? State.player2.pos: State.player2.pos+1;
    }

    player1_bar.style.top = State.player1.pos.toString()+"px"
    player2_bar.style.top = State.player2.pos.toString()+"px"

    // console.log("player1_bar.style.top: "+ player1_bar.style.top)
}

function update_ball(){

    //check collition with top 
    if (State.ball.y < 0){
        // State.ball.velY = Math.abs(State.ball.velY)

        //this first condition ensures that the ball is still coming towards it 
        State.ball.angle = (State.ball.angle > 180)? 
        mirror_angle_horizontally(State.ball.angle): State.ball.angle

        compute_ball_vel_from_angle()
    }//check if collision with bottom
    else if (State.ball.y > TABLE_HEIGHT){
        // State.ball.velY = -Math.abs(State.ball.velY)

        State.ball.angle = (State.ball.angle < 180)? 
        mirror_angle_horizontally(State.ball.angle): State.ball.angle
        compute_ball_vel_from_angle()
    }//check if collision with left
    if (State.ball.x < 0)
    {
        //player1 [left] just lost a ball, increase player 2 score
        State.player2.score++;
        init_game() //restart game
    }else if (State.ball.x > (TABLE_WIDTH - State.ball.diameter)){
        //player2 [right] just lost a ball, increase player 1 score
        State.player1.score++;
        init_game() //restart game
    }

    if (State.running){
        State.ball.x +=  State.ball.velX 
        State.ball.y +=  State.ball.velY 
    }

    if (colliction_check(State.player1, true)){
        
        //ADDing spin: check if a direction was still pressed then 
        //modify speed accordingly
        if (State.ball.angle > 90 && State.ball.angle < 270){
            
            if (State.keyPressed[State.player1_up]){
                State.ball.angle+=angle_Change
            }else if (State.keyPressed[State.player1_down]){
                State.ball.angle-=angle_Change
            }
            State.ball.angle = mirror_angle_vertically(State.ball.angle)
        }

        compute_ball_vel_from_angle(true)

        console.log("player 1 (LEFT) collision!!!")
    }

    else if (colliction_check(State.player2, false) ){      
        if (State.ball.angle < 90 || State.ball.angle > 270)
        {
            if (State.keyPressed[State.player2_up]){
                State.ball.angle-=angle_Change
            }else if (State.keyPressed[State.player2_down]){
                State.ball.angle+=angle_Change
            }
            State.ball.angle = mirror_angle_vertically(State.ball.angle)
        }
            

        compute_ball_vel_from_angle(true)

        console.log("player 2 (LEFT) collision!!!")

    }

    ball_circle.style.top = State.ball.y.toString() + "px"
    ball_circle.style.left = State.ball.x.toString() + "px"

}

(function() {
    //set key state on events 
    document.addEventListener('keydown',function(e){
        State.keyPressed[e.key] = true
        // console.log("key down: " + e.key + "key state: "+State.keyPressed[e.key])
    });
    document.addEventListener('keyup',function(e){
        State.keyPressed[e.key] = false
        // console.log("key up: " + e.key + " key state: "+State.keyPressed[e.key])
        if (e.key == ' '){
            State.running = true;
        }
    });

    //check keystate every 10ms
    setInterval(function () 
    {
        update_keypress();
        update_ball();
        update_score();
    }, ONE_SEC_IN_MS/FPS);  

    //listen to button event
    const reset_button = document.getElementById("reset_score_btn");
    reset_button.addEventListener("click", (e) => {
        console.log("reset pressed!")
        
        State.player1.score = 0;
        State.player2.score = 0;
        
        init_game()

    });

    

    init_game()
})();


// (function() {

//     //get event listener for keys 
//     const player1_bar = document.getElementById("player1")
//     const player2_bar = document.getElementById("player2")

//     document.addEventListener('keypress', (e) =>{

//         console.log("key pressed: "+e.key)

//         if (e.key == State.player1_up){
//             console.log("Player 1 up, pos: "+State.player1.pos.toString())
//             State.player1.pos = (State.player1.pos <= State.min_pos)? State.player1.pos: State.player1.pos-1;
//         }else if (e.key == State.player1_down){
//             console.log("Player 1 down, pos: "+State.player1.pos.toString())
//             State.player1.pos = (State.player1.pos >= State.max_pos)? State.player1.pos: State.player1.pos+1;
//         }else if (e.key == State.player2_up){
//             console.log("Player 2 up, pos: "+State.player2.pos.toString())
//             State.player2.pos = (State.player2.pos <= State.min_pos)? State.player2.pos: State.player2.pos-1;
//         }else if (e.key == State.player2_down){
//             console.log("Player 2 down, pos: "+State.player2.pos.toString())
//             State.player2.pos = (State.player2.pos >= State.max_pos)? State.player2.pos: State.player2.pos+1;
//         }else {
//             console.log("Undefined key press ")
//         }

//         player1_bar.style.top = State.player1.pos.toString()+"%"
//         player2_bar.style.top = State.player2.pos.toString()+"%"

//         console.log("player1_bar.style.top: "+ player1_bar.style.top)

//         // player1_bar.style.top = 20
//     })



// })();




